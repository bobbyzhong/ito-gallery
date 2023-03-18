import Head from "next/head";
import Image from "next/image";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { v4 as uuidv4 } from "uuid";
import { useState, useEffect } from "react";
import React from "react";
import Link from "next/link";
import supabase from "./api/supabaseClient";

// https://vcbwmzeulqsaazygypsh.supabase.co/storage/v1/object/public/images/00636e73-9cc4-4f73-9852-41e7c3fdf308

const CDNURL =
    "https://vcbwmzeulqsaazygypsh.supabase.co/storage/v1/object/public/images/";

export default function Home() {
    const supabase = useSupabaseClient();

    const [images, setImages] = useState<any>([]);

    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

    const [userId, setUserId] = useState<string | undefined>();

    useEffect(() => {
        const getUser = async () => {
            const user = await supabase.auth.getUser();
            console.log("user", user);
            if (user) {
                const userId = user.data.user?.id;
                setIsAuthenticated(true);
                setUserId(userId);
            }
        };
        getUser();
    }, []);

    async function signOut() {
        await supabase.auth.signOut();
        setIsAuthenticated(false);
    }

    async function getImages() {
        const { data, error } = await supabase.storage
            .from("images")
            .list("", { limit: 100 });

        if (data !== null) {
            setImages(data);
            console.log("hi");
        } else {
            alert("Error loading images");
            console.log(error);
        }
    }

    async function deleteImage(image: any) {
        const { error } = await supabase.storage
            .from("images")
            .remove([image.name]);

        if (error) {
            console.log(error);
            alert("error");
        } else {
            getImages();
        }
    }

    useEffect(() => {
        getImages();
    }, []);

    async function uploadImage(e: any) {
        let file = e.target.files[0];

        const { data, error } = await supabase.storage
            .from("images")
            .upload(uuidv4(), file);

        if (data) {
            getImages();
        } else {
            console.log(error);
        }
    }

    const hiddenFileInput = React.useRef<any>(null);

    const handleClick = (event: any) => {
        hiddenFileInput.current.click();
    };

    return (
        <>
            <div className="navbar w-full flex justify-between px-20 mt-5">
                <Image
                    src={"./plus.svg"}
                    alt={""}
                    height={40}
                    width={40}
                    onClick={handleClick}
                    className={"hover:cursor-pointer"}
                />
                <input
                    type="file"
                    ref={hiddenFileInput}
                    accept="image/png, image/jpeg, image/jpg"
                    style={{ display: "none" }}
                    onChange={(e) => uploadImage(e)}
                />
                {isAuthenticated ? (
                    <button onClick={() => signOut()}>Sign Out</button>
                ) : (
                    <Link href={"/login"}>Sign In</Link>
                )}
            </div>
            {images.length >= 1 ? (
                <div className="max-w-2xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
                    <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 gap-x-6 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
                        {images.map((image: any) => (
                            <div>
                                <BlurImage
                                    key={image}
                                    image={CDNURL + image.name}
                                />
                                {isAuthenticated ? (
                                    <button onClick={() => deleteImage(image)}>
                                        Delete
                                    </button>
                                ) : (
                                    ""
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                ""
            )}
        </>
    );
}

function BlurImage({ key, image }: { key: any; image: any }) {
    const [isLoading, setLoading] = useState(true);

    return (
        <div
            className="aspect-w-1 aspect-h-1 xl:aspect-w-7 xl:aspect-h-8 w-full
    overflow-hidden rounded-lg bg-gray-200"
        >
            <Image
                alt=""
                src={image}
                fill
                style={{ objectFit: "cover" }}
                className={` duration-700 ease-in-out
                    ${
                        isLoading
                            ? "grayscale blur-2xl scale-110"
                            : "grayscale-0 blur-0 scale-100"
                    }`}
                onLoadingComplete={() => setLoading(false)}
            />
        </div>
    );
}

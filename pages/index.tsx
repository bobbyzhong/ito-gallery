import Head from "next/head";
import Image from "next/image";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { v4 as uuidv4 } from "uuid";
import { useState, useEffect } from "react";
import React from "react";

// https://vcbwmzeulqsaazygypsh.supabase.co/storage/v1/object/public/images/00636e73-9cc4-4f73-9852-41e7c3fdf308

const CDNURL =
    "https://vcbwmzeulqsaazygypsh.supabase.co/storage/v1/object/public/images/";

export default function Home() {
    const supabase = useSupabaseClient();

    const [images, setImages] = useState<any>([]);

    async function getImages() {
        const { data, error } = await supabase.storage
            .from("images")
            .list("", { limit: 100, sortBy: { column: "name", order: "asc" } });

        if (data !== null) {
            setImages(data);
            console.log("hi");
        } else {
            alert("Error loading images");
            console.log(error);
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
                <h1>Sign in</h1>
            </div>

            <div className="max-w-2xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
                <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 gap-x-6 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
                    {images.map((image: any) => (
                        <BlurImage key={image} image={CDNURL + image.name} />
                    ))}
                </div>
            </div>
        </>
    );
}

function BlurImage({ key, image }: { key: any; image: any }) {
    const [isLoading, setLoading] = useState(true);

    return (
        <a href={image.href} className="group">
            <div
                className="aspect-w-1 aspect-h-1 xl:aspect-w-7 xl:aspect-h-8 w-full
    overflow-hidden rounded-lg bg-gray-200"
            >
                <Image
                    alt=""
                    src={image}
                    fill
                    style={{ objectFit: "cover" }}
                    className={`group-hover:opacity-75 duration-700 ease-in-out
                    ${
                        isLoading
                            ? "grayscale blur-2xl scale-110"
                            : "grayscale-0 blur-0 scale-100"
                    }`}
                    onLoadingComplete={() => setLoading(false)}
                />
            </div>
        </a>

        //     <a href={image} className="">
        //         <div
        //             className="
        // overflow-hidden rounded-lg"
        //         >
        //             <Image
        //                 key={key}
        //                 alt=""
        //                 src={image}
        //                 width={100}
        //                 height={100}
        //                 style={{ objectFit: "fill" }}
        //                 className={`group-hover:opacity-75 w-full object- duration-700 ease-in-out
        //                 ${
        //                     isLoading
        //                         ? "grayscale blur-2xl scale-110"
        //                         : "grayscale-0 blur-0 scale-100"
        //                 }`}
        //                 onLoadingComplete={() => setLoading(false)}
        //             />
        //         </div>
        //     </a>
    );
}

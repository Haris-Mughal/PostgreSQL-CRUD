import Image from "next/image";
import Link from "next/link";

export default function Home() {
    return (
        <div className="w-full h-full flex flex-col justify-center items-center pt-[18%]">
            <div className="w-[50%] h-[50%] text-center">
                <div className="text-[72px] font-bold text-center text-white">
                    Use CRUD
                </div>
                <Link
                    href="/users"
                    className="text-center text-xl mx-auto italic underline text-white"
                >
                    here
                </Link>
            </div>
        </div>
    );
}

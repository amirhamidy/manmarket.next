import CloseIcon from "../icons/closeIcon"



const InstallationSuggestion = () => {
    return (
        <div className="min-h-screen bg-[rgba(0,0,0,0.6)] flex justify-center items-end fixed top-0 right-0 left-0 bottom-0 z-[999999999999]">
            <div className="relative w-100 bg-amber-50 text-center flex justify-center flex-col rounded-t-xl">
                <span className="absolute top-3 left-2.5">
                    <CloseIcon />
                </span>
                <span className="my-3">دانلود اپلیکیشن من مارکت</span>
                <span className="my-3 flex justify-center">
                    <img className="w-[35%]" src="/assets/dn/m-main-android-1.png" />
                </span>
                <span className="my-3 flex justify-center">
                    <img className="w-[35%]" src="/assets/dn/m-main-android-2.png" />
                </span>
                <span className="my-3 flex justify-center">
                    <img className="w-[35%]" src="/assets/dn/m-main-android-3.png" />
                </span>
                <span className="my-3 flex justify-center">
                    <img className="w-[35%]" src="/assets/dn/m-main-android-4.png" />
                </span>
            </div>
        </div>
    )
}

export default InstallationSuggestion
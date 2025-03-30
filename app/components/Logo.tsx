export default function Logo(){
    return(
        <div className='flex justify-center place-items-center gap-2'>
            <img
                alt="Your Company"
                src="./public/react.svg"
                className="h-7 w-auto"
            />
            <span className="font-black text-gray-400 text-2xl">
            {/* <span className="font-black text-2xl bg-gradient-to-r from-cyan-100 via-yellow-300 to-purple-500 bg-clip-text text-transparent"> */}
                Learnify
            </span>
        </div>
    )
  }
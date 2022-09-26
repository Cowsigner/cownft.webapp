
import  React from 'react';

const Header = () => {

  const [mobile, setMobile] = React.useState(false)

   const handleClick = () => {
    setMobile(mobile => !mobile);
  };

  return (
    <div className="z-[100] flex w-full flex-col bg-transparent p-5">
  <div className="flex items-center justify-between">
    <div className="flex items-center">
      <a href="https://cowsigner.com" target="_blank">
        <div className="relative flex h-10 items-center flex-reverse font-bold">
          <span className='flex items-center gap-2'>
            Powered by
            <img
              alt="MySeed Logo"
              src="./images/cowsigner-logo-white-transparent.png"
              decoding="async"
              data-nimg="fill"
             className='h-20 inline'
            />
          </span>
        </div>
      </a>
      <div className="ml-10 hidden xl:flex">
        <div className="space-x-12">
        <div className="h-15 w-15 inline font-size-15 fontSize-16">

        </div>
        </div>
      </div>
    </div>
  </div>
</div>


  )
  
}


export default Header

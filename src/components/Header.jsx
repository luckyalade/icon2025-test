import React from "react";

const Header = () => {
  return (
    <div className="fixed top-[15px] left-1/2 -translate-x-1/2 z-50">
      <div className="container !max-w-full px-4">
        <div className="flex justify-between items-center">
          <div>
            <a>
              <img
                src="https://freight.cargo.site/w/4821/q/94/i/b3bf5f82f50fc53ab025b39d50330e123f184f27fbd2e7dbaf03d6fa0bbe994b/Icon-Logo-transparent.png"
                alt="Carton Logo"
                className={`w-[135px] h-[33px] hover:opacity-80 drop-shadow-sm drop-shadow-transparent shadow-2xl shadow-transparent transition-all duration-200 cursor-pointer hover:scale-[1.01]`}
              />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;

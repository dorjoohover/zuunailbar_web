import { siteData } from "@/lib/constants";
import Image from "next/image";
import React from "react";
import { HeroParallax } from "./ui/hero-parallax";

export const products = [
  {
    title: "1",
    link: "/",
    thumbnail: "https://scontent.fuln1-1.fna.fbcdn.net/v/t51.75761-15/485733759_18060424850295180_4157291704192160020_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=127cfc&_nc_ohc=dTpVHs36LPYQ7kNvwEBML2v&_nc_oc=AdmruvDU616o3-s_aKrbWl20HtpfhMIRKVMDjqtkqUnusO5XHLXx1QOn4AL7hjsoEna2aF2Rd99fLRW5Vq7ayn2W&_nc_zt=23&_nc_ht=scontent.fuln1-1.fna&_nc_gid=5e_H3lrvvlQKaQAc-CwXNA&oh=00_AfWigl_b_At-nfngk0j2UC04GbjPhbKAEcjkRSxvJH5HSQ&oe=689A37B4",
  },
  {
    title: "2",
    link: "/",
    thumbnail: "https://scontent.fuln1-1.fna.fbcdn.net/v/t51.75761-15/485733759_18060424850295180_4157291704192160020_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=127cfc&_nc_ohc=dTpVHs36LPYQ7kNvwEBML2v&_nc_oc=AdmruvDU616o3-s_aKrbWl20HtpfhMIRKVMDjqtkqUnusO5XHLXx1QOn4AL7hjsoEna2aF2Rd99fLRW5Vq7ayn2W&_nc_zt=23&_nc_ht=scontent.fuln1-1.fna&_nc_gid=5e_H3lrvvlQKaQAc-CwXNA&oh=00_AfWigl_b_At-nfngk0j2UC04GbjPhbKAEcjkRSxvJH5HSQ&oe=689A37B4",
  },
  {
    title: "3",
    link: "/",
    thumbnail: "https://scontent.fuln1-1.fna.fbcdn.net/v/t51.75761-15/485946097_18060065444295180_7252556736458500976_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=127cfc&_nc_ohc=voZIBuMfvY0Q7kNvwFVdnol&_nc_oc=Adnxcl9mUNkkFe6jBI6ITkln6FFGgwYMkxfDPFSE1GwoF4LTkZlsPiZG34d2afbjAmADJU6rsLZDb5IaM_sBFfIz&_nc_zt=23&_nc_ht=scontent.fuln1-1.fna&_nc_gid=xH_rDScAF0OG-9hpWSO__A&oh=00_AfUtnDxxQAe6NCOx8PcJovdGBSvID8qlvEBdS6-4L1nQiw&oe=689A41D0",
  },

  {
    title: "4",
    link: "/",
    thumbnail: "https://scontent.fuln1-2.fna.fbcdn.net/v/t51.82787-15/528696718_18073631120295180_6004454079971521114_n.jpg?stp=dst-jpegr_tt6&_nc_cat=108&ccb=1-7&_nc_sid=127cfc&_nc_ohc=kDhQLnWNn2oQ7kNvwFo_Pwd&_nc_oc=AdnQqrSo1ixZFmYIK5NT6QkTPmuM8u4qE09tIU-YiKt_Eq-0myPbfaz2TUGuh6ycCcDJFoIvmHInpTU7GqkczHyX&_nc_zt=23&se=-1&_nc_ht=scontent.fuln1-2.fna&_nc_gid=nCxBst6XFr97n3lqVCfkYQ&oh=00_AfVjBXVr9muo6rMVpw0hA2m_5jGqG02N8weDQYZkAYvpaw&oe=689A50C7",
  },
  {
    title: "5",
    link: "/",
    thumbnail: "https://scontent.fuln1-2.fna.fbcdn.net/v/t51.82787-15/527342198_18073176803295180_316217168800571757_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=127cfc&_nc_ohc=kKAfaqGKajsQ7kNvwHCGYLj&_nc_oc=Adk7OwevmhfsgQ4LOEgW7o7fy7h_BNWzpiaLjz6l380b1KR2I310rrT3g10z7iBJwIgLCgu0STQZXEg2Fi0svg2W&_nc_zt=23&_nc_ht=scontent.fuln1-2.fna&_nc_gid=L2sPhd4S4TzePJdtZmywmw&oh=00_AfXVnHo6jAB7k6Ba0aWEcml_QBSIx809BEv_ZB4uSKpbTA&oe=689A5C6D",
  },
  {
    title: "6",
    link: "/",
    thumbnail: "https://scontent.fuln1-1.fna.fbcdn.net/v/t51.75761-15/503588385_18067332413295180_5405480780179359049_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=127cfc&_nc_ohc=km8UHMYOc40Q7kNvwF4BTfV&_nc_oc=Adka_eGzpIDj851I0H6PYZNZBeJl3idsvg_VO8lWcVwpPP36BlrTz-sBzzTUb87QePs1RekuVItMKqokw7d0fU95&_nc_zt=23&_nc_ht=scontent.fuln1-1.fna&_nc_gid=JD6MVGDIZhJ1j73XyqkL4A&oh=00_AfVARFGHxeYMx3JaOKQd3baMmgK0HWb5210N6xPTNpYuNA&oe=689A5AD1",
  },

  {
    title: "7",
    link: "/",
    thumbnail: "https://scontent.fuln1-1.fna.fbcdn.net/v/t51.75761-15/500404318_18066104192295180_6645697438831120690_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=127cfc&_nc_ohc=ooTjd6Iaaj4Q7kNvwG_wIs1&_nc_oc=Adn2LpxRxuaEbZNQx38NzdDNSh51J4Jj26hBqpQm68PewvooyHWFn4HyUGWdCXhY5k2agJbhX-3qfysaWjLYjgHh&_nc_zt=23&_nc_ht=scontent.fuln1-1.fna&_nc_gid=LnG7NRGI05r4rWrIDHGtrw&oh=00_AfXNkyaI2ODhn_a5u4v0_6dQLZfPqhbrAT9ZRNXfNapOMw&oe=689A5F5D",
  },
  {
    title: "8",
    link: "/.com",
    thumbnail: "https://scontent.fuln1-2.fna.fbcdn.net/v/t51.75761-15/500559326_18065991134295180_6797626613196825006_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=127cfc&_nc_ohc=ZPOnQ_BQQBEQ7kNvwFJBF3p&_nc_oc=AdlYdF-1LFXUEQpfRpYMCy2W-o9_pcksPaemDOC6t4SPjzOHZNcQzCOkpdgXzO_mF-22N2JJ4eVyCTE_7A1oK740&_nc_zt=23&_nc_ht=scontent.fuln1-2.fna&_nc_gid=k6H27d7KzF-4M8ZmyQ2s2w&oh=00_AfUUfqSt3ufaTo6l0nS0Ag-zcvVe5n1DUEkgnBzG_nJFbQ&oe=689A47C1",
  },
  {
    title: "9",
    link: "/",
    thumbnail: "https://scontent.fuln1-1.fna.fbcdn.net/v/t51.75761-15/499417539_18065793743295180_7091262048984619808_n.jpg?stp=dst-jpegr_tt6&_nc_cat=111&ccb=1-7&_nc_sid=127cfc&_nc_ohc=7ZMwqVomE5wQ7kNvwGt0NS9&_nc_oc=AdkHMav5yiNkeUYwx_krxfjCI_saOW98XauUn5JuJQxUmJ9_QBABD1VTMbf-tMCOPsYb7OUJJ79MthtbgdBuUV42&_nc_zt=23&se=-1&_nc_ht=scontent.fuln1-1.fna&_nc_gid=p49cTec_ZAAjWKBnIW6b7Q&oh=00_AfWdMMjUnqt33WoLdRNpLBA3JcfL-Xz6ZBDleLZROfTczw&oe=689A470B",
  },
  {
    title: "10",
    link: "/",
    thumbnail: "https://scontent.fuln1-1.fna.fbcdn.net/v/t51.75761-15/496639884_18064624823295180_8708813469201871261_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=127cfc&_nc_ohc=H0sM-c53L9cQ7kNvwF70-Il&_nc_oc=AdmMtHPJOm-uKbOs9QftWlNrgCl60gden79SbT_oqL__Hj27guTdPpfwmm3Pr6wl7fxCK2cRaIDpFzNy1myCXrwY&_nc_zt=23&_nc_ht=scontent.fuln1-1.fna&_nc_gid=Dl1TdUW-Ut33EDyswceGUQ&oh=00_AfVlpPj2AUAeV_7-tu6_4O3XnTcALue5hdDpW0a5UQhdYg&oe=689A45AA",
  },
  {
    title: "11",
    link: "/",
    thumbnail: "https://scontent.fuln1-2.fna.fbcdn.net/v/t51.75761-15/491119882_18062729660295180_6243912064257920539_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=127cfc&_nc_ohc=aFvestIySDgQ7kNvwENA4UN&_nc_oc=AdmzVOYdXzBv9qOWs2k9rKcwdlx6dnDKEMFS3n11lMbUjCdP0r_4-U579IynLC3AxyD13ndiJxwAc0UoDWw5q_9n&_nc_zt=23&_nc_ht=scontent.fuln1-2.fna&_nc_gid=ZgCjrTm4iySXZsK_0YOCuw&oh=00_AfUTLkdz3hBV2U9ecayy4NxDRgZb6_M2vR8JsehWRUrvbw&oe=689A5484",
  },
];

export default function HeroSection() {
  return (
    <div className="bg-no-repeat bg-cover bg-center bg-[url('/bg/gradient-bg.png')">
      <HeroParallax products={products} />;
      {/* <section className="container py-10 pb-0 ">
        <div className="flex h-full gap-4">
          <div className="h-[500px] basis-3/5 bg-no-repeat bg-cover relative rounded-4xl ">
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden custom_shadow"></div>
            <Image src={"/images/nail/1.png"} width={1200} height={400} className="relative z-10 object-cover h-full overflow-hidden border-b border-l border-pink-50/40 rounded-4xl backdrop-blur-md-2xl" alt="" />
          </div>
          <div className="h-[500px] relative overflow-hidden basis-2/5 rounded-4xl">
            <Image src={"/images/nail/2.png"} width={1200} height={400} className="z-0 object-cover h-full" alt="" />
          </div>
        </div>
      </section>*/}
      <section className="border-b border-gray-200">
        <div className="container grid grid-cols-4 py-16 divide-gray-700 divide-x-1">
          {siteData.features.map((item, index) => (
            <div key={index} className="justify-center gap-6 text-center text-white col-center">
              <div className="text-white bg-[url('/images/glass-frame.png')] bg-no-repeat bg-cover rounded-3xl size-18 aspect-square flex-center shadow-sm">{item.icon ? <item.icon className="" strokeWidth={"1.5px"} /> : <span className="text-xs ">No Icon</span>}</div>
              <div className="space-y-2">
                <h3 className="text-xl">Lorem, ipsum.</h3>
                <p className="text-sm text-gray-500">Lorem ipsum dolor sit </p>
              </div>
            </div>
          ))}
        </div>
      </section> 
    </div>
  );
}

import {
  Brush,
  BrushCleaning,
  Bubbles,
  Component,
  Eraser,
  Facebook,
  Footprints,
  Hand,
  Instagram,
  Mail,
  Scissors,
  Smartphone,
  Sparkles,
} from "lucide-react";

export const siteData = {
  navItems: [
    {
      name: "Үйлчилгээ",
      link: "/service",
    },
    {
      name: "Бидний тухай",
      link: "/about",
    },
  ],
  features: [
    {
      id: 1,
      title: "Мэргэжлийн мастерууд",
      icon: Sparkles,
      description: "Туршлагатай мэргэжилтнүүд таны гоо сайхныг хариуцна",
    },
    {
      id: 2,
      title: "Цэвэр орчин",
      icon: Bubbles,
      description:
        "Ариутгал, эрүүл ахуйн стандартыг бүрэн хангасан тав тухтай орчин",
    },
    {
      id: 3,
      title: "Өргөн сонголт, загварууд",
      icon: Component,
      description: "Олон төрлийн дезайнуудаас сонгох боломжтой",
    },
    {
      id: 4,
      title: "Онлайн захиалга",
      icon: Smartphone,
      description: "Ухаалаг утсаараа цаг захиалаад үйлчлүүлээрэй",
    },
  ],
  mainService: [
    {
      title: "Маникюр",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ex, inventore enim obcaecati rerum eius tempora? Ipsa iure incidunt dicta reiciendis?",
      image: "/images/nail/1.png",
    },
    {
      title: "Педикюр",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ex, inventore enim obcaecati rerum eius tempora? Ipsa iure incidunt dicta reiciendis?",
      image: "/images/nail/2.png",
    },
  ],
  detailService: [
    {
      id: 1,
      title: "Гелэн будалт",
      price: "50'000₮",
      description: "Удаан эдэлгээтэй, өнгөлөг гелэн будалтаар хумсаа чимэглэе.",
      icon: Brush,
    },
    {
      id: 2,
      title: "Смарт хумстай будалт",
      price: "50'000₮",
      description:
        "Өнгө, дизайн, чимэглэлээ өөртөө тааруулан сонгох ухаалаг будалт.",
      icon: Sparkles,
    },
    {
      id: 3,
      title: "Педикюр",
      price: "50'000₮",
      description:
        "Хөлийн эрүүл мэнд, гоо үзэсгэлэнг хослуулсан иж бүрэн педикюр үйлчилгээ.",
      icon: Footprints,
    },
    {
      id: 4,
      title: "Нөхөлт гар",
      price: "50'000₮",
      description:
        "Хумсны эвдэрсэн хэсгийг сэргээж, анхны хэлбэрийг нь хадгална.",
      icon: Hand,
    },
    {
      id: 5,
      title: "Нөхөлт хөл",
      price: "50'000₮",
      description:
        "Хөлийн хумсны гэмтэл, ховхролтыг сэргээж, цэвэрхэн харагдуулна.",
      icon: BrushCleaning,
    },
    {
      id: 6,
      title: "Арилгалт",
      price: "50'000₮",
      description: "Хумсны хуучин будалтыг зөөлөн, гэмтээлгүйгээр арилгана.",
      icon: Eraser,
    },
    {
      id: 7,
      title: "Салгалт",
      price: "50'000₮",
      description: "Хуучин хиймэл хумс, чимэглэлийг гэмтээлгүйгээр салгана.",
      icon: Scissors,
    },
    {
      id: 8,
      title: "Цэвэрлэгээ",
      price: "50'000₮",
      description: "Хумс болон арьсны эрүүл мэндийг хамгаалсан гүн цэвэрлэгээ.",
      icon: BrushCleaning,
    },
  ],

  address: [
    {
      id: 1,
      name: "ХАА-н яамны замын урд талд Орчлон комплекс 3 давхар 311 тоот",
      city: "Улаанбаатар хот",
      link: "https://maps.app.goo.gl/m5moYfUYC1f6aJXx9",
    },
    {
      id: 2,
      name: "Crystal town хотхоны замын урд ХИМЧАН оффис 6 давхар 603 тоот",
      city: "Улаанбаатар хот",
      link: "https://maps.app.goo.gl/VwZqcs7PsH1ddk41A",
    },
  ],
  footerLinks: [
    {
      icon: Facebook,
      url: "https://www.facebook.com/profile.php?id=100090649232252",
    },
    {
      icon: Instagram,
      url: "https://www.instagram.com/zu_nailbar",
    },
    // {
    //   icon: Mail,
    //   url: "https://www.facebook.com/zunailbar",
    // },
  ],
};

export const orderSteps = [
  {
    name: "Үйлчилгээ сонгох",
  },
  {
    name: "Артист сонгох (заавал биш)",
  },
  {
    name: "Огноо ба цаг сонгох",
  },
  {
    name: "Баталгаажуулах",
  },
];

export enum OrderStatus {
  // uridchilgaa toloogui
  Pending = 10,
  // uridchilgaa tolson
  Active = 20,
  // uilchilgee ehelsen
  Started = 30,
  // duussan
  Finished = 40,
  // tsutsalsan
  Cancelled = 50,
  // tsutsalsan
  Absent = 60,
  Friend = 70,
}
export const StatusValue = {
  [OrderStatus.Pending]: "Хүлээгдэж байна.",
  [OrderStatus.Active]: "Төлбөр төлөгдсөн.",
  [OrderStatus.Started]: "Үйлчилгээ эхэлсэн.",
  [OrderStatus.Finished]: "Үйлчилгээ дууссан.",
  [OrderStatus.Cancelled]: "Үйлчилгээ цуцлагдсан.",
  [OrderStatus.Absent]: "Ирээгүй.",
  [OrderStatus.Friend]: "Танил.",
};
export const StatusColor = {
  [OrderStatus.Pending]: "bg-yellow-300 text-yellow-800", // Төлбөр хүлээгдэж байна
  [OrderStatus.Active]: "bg-blue-300 text-blue-800", // Төлбөр төлөгдсөн
  [OrderStatus.Started]: "bg-purple-300 text-purple-800", // Үйлчилгээ эхэлсэн
  [OrderStatus.Finished]: "bg-green-300 text-green-800", // Үйлчилгээ дууссан
  [OrderStatus.Cancelled]: "bg-red-300 text-red-800", // Цуцлагдсан
  [OrderStatus.Absent]: "bg-gray-300 text-gray-800", // Ирээгүй
  [OrderStatus.Friend]: "bg-pink-300 text-pink-800", // Танил
};

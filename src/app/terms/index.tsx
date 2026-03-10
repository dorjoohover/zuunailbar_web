"use client";
import { motion } from "motion/react";
import {
  AlertTriangle,
  BookOpen,
  Clock,
  AlertCircle,
  Ban,
  Hourglass,
  Shield,
  RefreshCw,
} from "lucide-react";

export function Terms() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="pb-16 pt-4 sm:pt-8"
    >
      <div className="mb-12 text-center space-y-5">
        <h1 className="text-[28px] sm:text-[34px] leading-tight font-extrabold text-gray-900 tracking-tight text-balance">
          Zu Nailbar — Онлайн цаг захиалгын үйлчилгээний нөхцөл
        </h1>
        <p className="text-gray-500 max-w-[600px] mx-auto leading-[1.8] text-[15px] sm:text-base text-balance">
          Энэхүү Үйлчилгээний нөхцөл нь онлайн цаг захиалгын вэбсайтаар
          дамжуулан үйлчилгээ авахтай холбоотойгоор хэрэглэгч (цаашид
          "Захиалагч" гэх) болон үйлчилгээ үзүүлэгч (цаашид "Үйлчилгээ үзүүлэгч"
          гэх)-ийн хооронд үүсэх эрх, үүрэг, хариуцлагыг зохицуулна.
        </p>
      </div>

      <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-100">
        <Section
          title="1. Ерөнхий заалт"
          icon={<BookOpen size={22} className="text-pink-500" />}
        >
          <ul className="space-y-4 text-gray-600 text-[15px] leading-relaxed">
            <li className="flex gap-4 items-start">
              <span className="font-bold text-gray-900 shrink-0 tabular-nums">
                1.1.
              </span>
              <span>
                Захиалагч нь онлайн цаг захиалгыг баталгаажуулснаар энэхүү
                үйлчилгээний нөхцөлийг бүрэн уншиж танилцсан, хүлээн зөвшөөрсөнд
                тооцогдоно.
              </span>
            </li>
            <li className="flex gap-4 items-start">
              <span className="font-bold text-gray-900 shrink-0 tabular-nums">
                1.2.
              </span>
              <span>
                Үйлчилгээ үзүүлэгч нь захиалгын системээр дамжуулан цаг
                захиалах, баталгаажуулах, урьдчилгаа төлбөр хүлээн авах
                үйлчилгээг үзүүлнэ.
              </span>
            </li>
          </ul>
        </Section>

        <Section
          title="2. Цаг захиалга"
          icon={<Clock size={22} className="text-pink-500" />}
        >
          <ul className="space-y-4 text-gray-600 text-[15px] leading-relaxed">
            <li className="flex gap-4 items-start">
              <span className="font-bold text-gray-900 shrink-0 tabular-nums">
                2.1.
              </span>
              <span>
                Захиалагч нь вэбсайтад байршуулсан боломжит өдрүүд, цагуудаас
                сонгон цаг захиална.
              </span>
            </li>
            <li className="flex gap-4 items-start">
              <span className="font-bold text-gray-900 shrink-0 tabular-nums">
                2.2.
              </span>
              <span>
                Цаг захиалга нь урьдчилгаа төлбөр төлөгдсөнөөр хүчин төгөлдөр
                болно.
              </span>
            </li>
            <li className="flex gap-4 items-start">
              <span className="font-bold text-gray-900 shrink-0 tabular-nums">
                2.3.
              </span>
              <span>
                Нэг захиалсан цаг нь тухайн Захиалагчид зориулан тусгайлан
                хадгалагдах тул тухайн хугацаанд өөр хэрэглэгчид олгогдохгүй.
              </span>
            </li>
          </ul>
        </Section>

        <Section
          title="3. Урьдчилгаа төлбөрийн нөхцөл"
          icon={<AlertCircle size={22} className="text-pink-500" />}
        >
          <ul className="space-y-4 text-gray-600 text-[15px] leading-relaxed">
            <li className="flex gap-4 items-start">
              <span className="font-bold text-gray-900 shrink-0 tabular-nums">
                3.1.
              </span>
              <span>
                Захиалга хийх үед төлсөн урьдчилгаа төлбөр нь буцаан
                олгогдохгүй.
              </span>
            </li>
            <li className="flex gap-4 items-start">
              <span className="font-bold text-gray-900 shrink-0 tabular-nums">
                3.2.
              </span>
              <span>
                Энэхүү урьдчилгаа төлбөр нь тухайн цагийг дүүргэж ашиглаагүйгээс
                үүсэх алданги, боломжит орлогын нөхөн төлбөр гэж тооцогдоно.
              </span>
            </li>
            <li className="flex flex-col gap-3 mt-4 items-start">
              <div className="flex gap-4 w-full">
                <span className="font-bold text-gray-900 shrink-0 tabular-nums">
                  3.3.
                </span>
                <span className="font-medium text-gray-900">
                  Дараах тохиолдлуудад урьдчилгаа төлбөрийг буцаан олгохгүй:
                </span>
              </div>
              <ul className="ml-[42px] space-y-2.5 text-gray-500 list-disc pl-2 marker:text-pink-300">
                <li>Захиалсан цагаа цуцалсан</li>
                <li>Захиалсан цагтаа ирээгүй</li>
                <li>Хоцорч ирсэн</li>
                <li>
                  Захиалсан цагийг өөр өдөр, цагт хойшлуулах хүсэлт гаргасан
                </li>
              </ul>
            </li>
          </ul>
        </Section>

        <Section
          title="4. Цаг цуцлах, өөрчлөх нөхцөл"
          icon={<Ban size={22} className="text-pink-500" />}
        >
          <ul className="space-y-4 text-gray-600 text-[15px] leading-relaxed">
            <li className="flex gap-4 items-start">
              <span className="font-bold text-gray-900 shrink-0 tabular-nums">
                4.1.
              </span>
              <span>
                Захиалсан цагийг цуцлах, өөрчлөх, хойшлуулах боломжгүй.
              </span>
            </li>
            <li className="flex gap-4 items-start">
              <span className="font-bold text-gray-900 shrink-0 tabular-nums">
                4.2.
              </span>
              <span>
                Захиалагч нь өөрийн хувийн шалтгаан, цаг агаар, замын түгжрэл
                зэрэг нөхцөл байдлаас үл хамааран захиалсан цагтаа ирэх
                үүрэгтэй.
              </span>
            </li>
          </ul>
        </Section>

        <Section
          title="5. Хоцролт"
          icon={<Hourglass size={22} className="text-pink-500" />}
        >
          <ul className="space-y-4 text-gray-600 text-[15px] leading-relaxed">
            <li className="flex gap-4 items-start">
              <span className="font-bold text-gray-900 shrink-0 tabular-nums">
                5.1.
              </span>
              <span>
                Захиалсан цагаасаа хоцорсон тохиолдолд үйлчилгээний хугацаа
                сунгагдахгүй.
              </span>
            </li>
            <li className="flex gap-4 items-start">
              <span className="font-bold text-gray-900 shrink-0 tabular-nums">
                5.2.
              </span>
              <span>
                Хэт хоцорсон тохиолдолд Үйлчилгээ үзүүлэгч тухайн захиалгыг
                ирээгүйд тооцох эрхтэй.
              </span>
            </li>
          </ul>
        </Section>

        <Section
          title="6. Хариуцлага"
          icon={<AlertTriangle size={22} className="text-pink-500" />}
        >
          <ul className="space-y-4 text-gray-600 text-[15px] leading-relaxed">
            <li className="flex gap-4 items-start">
              <span className="font-bold text-gray-900 shrink-0 tabular-nums">
                6.1.
              </span>
              <span>
                Захиалагч үйлчилгээний нөхцөлийг зөрчсөнөөс үүсэх аливаа
                хохирлыг өөрөө бүрэн хариуцна.
              </span>
            </li>
            <li className="flex gap-4 items-start">
              <span className="font-bold text-gray-900 shrink-0 tabular-nums">
                6.2.
              </span>
              <span>
                Үйлчилгээ үзүүлэгч нь ашиглагдаагүй цагийн орлогын алдагдлыг
                хариуцахгүй.
              </span>
            </li>
          </ul>
        </Section>

        <Section
          title="7. Нууцлал"
          icon={<Shield size={22} className="text-pink-500" />}
        >
          <ul className="space-y-4 text-gray-600 text-[15px] leading-relaxed">
            <li className="flex gap-4 items-start">
              <span className="font-bold text-gray-900 shrink-0 tabular-nums">
                7.1.
              </span>
              <span>
                Захиалга хийх явцад цуглуулсан хувийн мэдээллийг холбогдох хууль
                тогтоомжийн дагуу хамгаална.
              </span>
            </li>
            <li className="flex gap-4 items-start">
              <span className="font-bold text-gray-900 shrink-0 tabular-nums">
                7.2.
              </span>
              <span>
                Хувийн мэдээллийг зөвхөн үйлчилгээ үзүүлэх зорилгоор ашиглана.
              </span>
            </li>
          </ul>
        </Section>

        <Section
          title="8. Бусад"
          icon={<RefreshCw size={22} className="text-pink-500" />}
        >
          <ul className="space-y-4 text-gray-600 text-[15px] leading-relaxed">
            <li className="flex gap-4 items-start">
              <span className="font-bold text-gray-900 shrink-0 tabular-nums">
                8.1.
              </span>
              <span>
                Үйлчилгээ үзүүлэгч нь үйлчилгээний нөхцөлийг шинэчлэх эрхтэй.
              </span>
            </li>
            <li className="flex gap-4 items-start">
              <span className="font-bold text-gray-900 shrink-0 tabular-nums">
                8.2.
              </span>
              <span>
                Шинэчилсэн нөхцөл нь вэбсайтад байршуулсан өдрөөс эхлэн хүчин
                төгөлдөр мөрдөгдөнө.
              </span>
            </li>
          </ul>
        </Section>
      </div>

      <div className="mt-10 bg-rose-50 border border-rose-100/80 rounded-2xl p-6 flex gap-4 items-start shadow-sm">
        <div className="bg-pink-100 p-2.5 rounded-full text-pink-600 shrink-0">
          <AlertTriangle size={24} strokeWidth={2} />
        </div>
        <div className="pt-0.5">
          <h4 className="font-bold text-pink-900 mb-1.5 text-lg tracking-tight">
            Анхааруулга
          </h4>
          <p className="text-pink-800 text-[15px] leading-relaxed">
            Цаг захиалга хийхээс өмнө үйлчилгээний нөхцөлийг сайтар уншиж
            танилцана уу.
          </p>
        </div>
      </div>
    </motion.div>
  );
}

function Section({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="p-6 sm:p-8 hover:bg-slate-50/50 transition-colors">
      <div className="flex items-center gap-4 mb-6">
        <div className="p-2.5 bg-pink-50 border border-pink-100/50 rounded-xl shadow-sm">
          {icon}
        </div>
        <h2 className="text-xl sm:text-[22px] font-bold text-gray-900 tracking-tight">
          {title}
        </h2>
      </div>
      <div className="sm:pl-[68px]">{children}</div>
    </div>
  );
}

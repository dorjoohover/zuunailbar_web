"use client";

import { motion } from "motion/react";
import { Shield, Trash2, Mail, Globe, Phone } from "lucide-react";

export function Deletion() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto py-10 px-4"
    >
      {/* HEADER */}
      <div className="mb-12 text-center space-y-5">
        <h1 className="text-[28px] sm:text-[34px] leading-tight font-extrabold text-gray-900 tracking-tight text-balance">
          Zu Nailbar — Нууцлалын бодлого
        </h1>
        <p className="text-gray-500 max-w-[600px] mx-auto leading-[1.8] text-[15px] sm:text-base text-balance">
          Энэхүү Үйлчилгээний нөхцөл нь онлайн цаг захиалгын вэбсайтаар
          дамжуулан үйлчилгээ авахтай холбоотойгоор хэрэглэгч (цаашид
          "Захиалагч" гэх) болон үйлчилгээ үзүүлэгч (цаашид "Үйлчилгээ үзүүлэгч"
          гэх)-ийн хооронд үүсэх эрх, үүрэг, хариуцлагыг зохицуулна.
        </p>
      </div>

      <div className="space-y-10">
        {/* 1 */}
        <Section title="1. Зорилго ба хамрах хүрээ">
          <p className="text-gray-600 whitespace-pre-line mb-4">
            Энэхүү Мэдээлэл Устгах Журам (цаашид "Журам") нь [Таны компанийн
            нэр]-ийн аппликейшн (цаашид "Апп")-д хэрэглэгчийн хувийн мэдээллийг
            устгах үйл явцыг зохицуулна. Журам нь Meta (Facebook) Платформын
            Нөхцөл болон холбогдох мэдээлэл хамгаалах хуулиудад (GDPR, CCPA,
            COPPA) нийцэж боловсруулагдсан.
            {"\n"}
            Энэхүү Журам нь дараах этгээдэд хамаарна:
          </p>
          <Checklist
            items={[
              "Аппыг ашиглаж буй бүх хэрэглэгч",
              "Facebook Login-аар нэвтэрсэн хэрэглэгч ",
              "Манай үйлчилгээтэй өмнө нь холбогдсон хэрэглэгч ",
              "Хэрэглэгчийн өмөөлөн хүсэлт гаргаж буй гуравдагч этгээд (хууль ёсны итгэмжлэгдсэн төлөөлөгч) ",
            ]}
          />
        </Section>

        {/* 2 */}
        <Section title="2. Meta платформын шаардлага">
          <p className="text-gray-600 whitespace-pre-line mb-4">
            Meta-н хөгжүүлэгчийн бодлогын дагуу бид дараах үүргийг хүлээнэ:{" "}
          </p>
          <Checklist
            items={[
              "30 хоногийн дотор устгах",
              "Tracking код олгох",
              "Устгалтыг баталгаажуулах",
              "Facebook dashboard-д URL бүртгэх",
            ]}
          />
        </Section>

        {/* 3 */}
        <Section title="3. Мэдээлэл устгах хүсэлт гаргах арга">
          <p className="text-gray-600 whitespace-pre-line mb-4">
            Хэрэглэгч доорх аргуудын аль нэгээр мэдээлэл устгах хүсэлт гаргаж
            болно:
          </p>
          <SubTitle>Апп доторх тохиргоогоор</SubTitle>
          <Steps
            steps={[
              "Апп руу нэвтрэх",
              "Тохиргоо руу орох",
              '"Нууцлал" → "Данс" хэсгийг сонгоно ',
              '"Миний мэдээллийг устгах" товчийг дарна ',
              "Устгах шалтгаанаа сонгон, баталгаажуулна ",
              "Хүсэлтийн баталгаажуулах код хүлээн авна ",
            ]}
          />

          <SubTitle> И-мэйлээр хүсэлт гаргах</SubTitle>
          <p className="text-gray-600">
            Та дараах хаягаар и-мэйл илгээн хүсэлтээ гаргаж болно:
          </p>
          <div>
            <div>
              <span className="text-sm text-gray-500">И-мэйл хаяг</span>
              <div>
                <a
                  href="mailto:zu.nailbar@gmail.com?subject=Мэдээлэл устгах хүсэлт"
                  className="text-blue-600 font-semibold hover:underline break-all"
                >
                  zu.nailbar@gmail.com
                </a>
              </div>
            </div>

            {/* SUBJECT */}
            <div>
              <span className="text-sm text-gray-500">Гарчиг</span>
              <div className="text-gray-900 font-medium">
                Мэдээлэл устгах хүсэлт / Data Deletion Request
              </div>
            </div>

            {/* CONTENT */}
            <div>
              <span className="text-sm text-gray-500">Агуулга</span>
              <ul className="list-disc pl-5 text-gray-700 space-y-1">
                <li>Бүртгэлтэй и-мэйл хаяг</li>
                <li>Facebook хэрэглэгчийн нэр (байгаа бол)</li>
                <li>Хүсэлтийн шалтгаан</li>
              </ul>
            </div>
          </div>

          <SubTitle>Facebook-н дансаар шууд хүсэлт гаргах</SubTitle>
          <p className="text-gray-600 mb-4">
            Meta-н платформоос шууд хүсэлт гаргахдаа:
          </p>
          <Steps
            steps={[
              "Facebook дансандаа нэвтэрнэ ",
              "Тохиргоо → Нууцлал → Таны Facebook мэдээлэл рүү орно ",
              '"Апп ба вэбсайт" хэсгийг сонгоно ',
              'Манай аппыг олоод "Устгах" товчийг дарна ',
              "Meta манай системд устгах хүсэлт автоматаар илгээнэ ",
            ]}
          />
          <SubTitle>Вэбсайтаар хүсэлт гаргах</SubTitle>
          <p className="text-gray-600 mb-4">
            Манай вэбсайтын www.zu.nailbar/deletion хаягаар орж онлайн маягт
            бөглөн хүсэлт гаргаж болно. Маягтад дараах мэдээлэл шаардлагатай:
          </p>
          <Checklist
            items={[
              "Бүртгэлтэй и-мэйл хаяг",
              "Facebook хэрэглэгчийн ID (шаардлагатай бол) ",
              "Устгалт хийх шалтгаан (заавал биш) ",
            ]}
          />
        </Section>

        {/* 4 */}
        <Section title="4. Хүсэлт боловсруулах дотоод журам ">
          <p className="text-gray-600 mb-4">
            Мэдээлэл устгах хүсэлт ирсэний дараа дараах дарааллаар боловсруулна:
          </p>
          <Steps
            steps={[
              "Хүсэлт хүлээн авсан өдрөөс хойш 3 ажлын өдөрт хэрэглэгчийн бие хэнийг болохыг баталгаажуулна ",
              "Баталгаажуулах и-мэйл болон хянах код (tracking code) хэрэглэгчид илгээнэ ",
              "7 хоногийн дотор мэдээллийн санд хайлт хийж холбогдох бүх мэдээллийг тодорхойлно ",
              "Хуулийн үүрэг буюу тогтоосон хадгалах хугацааны шаардлага байгаа эсэхийг шалгана ",
              "Шаардлагатай мэдээллийг устгахаас хасаж, үлдсэнийг 30 хоногийн дотор бүрэн устгана ",
              "Устгалт дууссан тухай баталгаажуулах мэдэгдэл хэрэглэгчид илгээнэ ",
            ]}
          />
        </Section>

        {/* 5 */}
        <Section title="5. Устгах мэдээллийн жагсаалт">
          <CardList
            items={[
              "Бүртгэлийн мэдээлэл",
              "Профайл",
              "Контент",
              "Facebook өгөгдөл",
              "Лог мэдээлэл",
            ]}
          />
        </Section>

        {/* CONTACT */}
        <Section title="Холбоо барих">
          <ContactCard />
        </Section>
      </div>
    </motion.div>
  );
}

function Section({ title, children }: any) {
  return (
    <div className="p-6 rounded-2xl border bg-white shadow-sm">
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      {children}
    </div>
  );
}
function Steps({ steps }: any) {
  return (
    <div className="space-y-3">
      {steps.map((s: string, i: number) => (
        <div key={i} className="flex gap-3 items-start">
          <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 font-bold">
            {i + 1}
          </div>
          <div className="text-gray-600">{s}</div>
        </div>
      ))}
    </div>
  );
}
function CardList({ items }: any) {
  return (
    <div className="grid sm:grid-cols-2 gap-3">
      {items.map((item: string, i: number) => (
        <div key={i} className="p-3 rounded-xl border bg-gray-50 text-gray-700">
          {item}
        </div>
      ))}
    </div>
  );
}
function ContactCard() {
  return (
    <div className="grid sm:grid-cols-2 gap-4">
      <Item
        icon={<Mail size={16} />}
        label="И-мэйл"
        value="zu.nailbar@gmail.com"
        link
      />
      <Item
        icon={<Globe size={16} />}
        label="Вэбсайт"
        value="zunailbar.mn"
        link
      />
      <Item icon={<Phone size={16} />} label="Утас" value="+976 86080708" />
      <Item
        icon={<Shield size={16} />}
        label="Байгууллага"
        value="Zu Nailbar"
      />
    </div>
  );
}

function Item({ icon, label, value, link }: any) {
  return (
    <div className="p-4 border rounded-xl bg-gray-50 flex gap-3 items-start">
      {icon}
      <div>
        <div className="text-xs text-gray-500">{label}</div>
        {link ? (
          <a className="text-blue-600 font-semibold">{value}</a>
        ) : (
          <div className="font-semibold">{value}</div>
        )}
      </div>
    </div>
  );
}
function SubTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-sm font-semibold text-gray-900 mt-6 mb-2">
      {children}
    </h3>
  );
}
function Checklist({ items }: any) {
  return (
    <ul className="space-y-2 text-gray-600">
      {items.map((item: string, i: number) => (
        <li key={i} className="flex gap-2">
          <span>✓</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

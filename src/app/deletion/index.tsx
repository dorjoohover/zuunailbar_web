"use client";

import { motion } from "motion/react";
import { Shield, Trash2, Mail, Globe, Phone, Clock, LocationEdit } from "lucide-react";

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

        <div className="space-y-6">
          {/* TITLE */}
          <h2 className="text-xl font-bold text-gray-900">
            5. Устгах мэдээллийн жагсаалт
          </h2>

          {/* 5.1 */}
          <div className="p-5 rounded-2xl border bg-white shadow-sm space-y-4">
            <h3 className="font-semibold text-gray-900">
              5.1 Бүрэн устгах мэдээлэл
            </h3>

            <p className="text-gray-600">
              Дараах мэдээлэл хүсэлт гарсан өдрөөс хойш 30 хоногийн дотор бүрэн
              устгагдана:
            </p>

            <ul className="space-y-2 text-gray-700">
              {[
                "Бүртгэлийн мэдээлэл: нэр, и-мэйл хаяг, нууц үг",
                "Профайлын мэдээлэл: зураг, намтар, хувийн мэдээлэл",
                "Хэрэглэгчийн үүсгэсэн контент: нийтлэл, сэтгэгдэл, файл",
                "Facebook-с авсан мэдээлэл: User ID, нийгмийн харилцааны өгөгдөл",
                "Төхөөрөмжийн таних тэмдэг: Advertising ID, IDFA",
                "Хэрэглээний түүх ба лог өгөгдөл",
                "Хадгалагдсан тохиргоо ба сонголт",
                "Харилцааны бичлэг (мессеж, дэмжлэгийн тасалбар)",
              ].map((item, i) => (
                <li key={i} className="flex gap-2">
                  <span>•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 5.2 */}
          <div className="p-5 rounded-2xl border bg-white shadow-sm space-y-4">
            <h3 className="font-semibold text-gray-900">
              5.2 Хэсэгчлэн хадгалах мэдээлэл
            </h3>

            <p className="text-gray-600">
              Дараах мэдээллийг хуулийн шаардлага буюу хууль ёсны зорилгоор
              тодорхой хугацаанд хадгалж болно:
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-sm border rounded-xl overflow-hidden">
                <thead className="bg-gray-100 text-gray-700">
                  <tr>
                    <th className="text-left p-3">Мэдээллийн төрөл</th>
                    <th className="text-left p-3">Хадгалах хугацаа</th>
                    <th className="text-left p-3">Тайлбар</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    {
                      type: "Санхүүгийн гүйлгээний бичлэг ",
                      time: "7 жил",
                      note: "Татварын хуулийн шаардлага ",
                      highlight: true,
                    },
                    {
                      type: "Залилан мэхлэлтийн тэмдэглэл",
                      time: "5 жил",
                      note: "Аюулгүй байдлын зорилго ",
                      highlight: true,
                    },
                    {
                      type: "Хуулийн маргааны холбогдох мэдээлэл ",
                      time: "Шийдвэр хүртэл  ",
                      note: "Шүүхийн үйл явц",
                    },
                    {
                      type: "Нэрийг хасан анонимчилсан аналитик ",
                      time: "Хугацаагүй",
                      note: "Статистик зорилго",
                    },
                    {
                      type: "COPPA хүүхдийн мэдээлэл",
                      time: "Шууд устгана",
                      note: "Хүүхдийн хамгаалал",
                      highlight: true,
                    },
                  ].map((row, i) => (
                    <tr key={i} className="border-t">
                      <td className="p-3">{row.type}</td>
                      <td
                        className={`p-3 font-semibold ${row.highlight ? "text-red-500" : ""}`}
                      >
                        {row.time}
                      </td>
                      <td className="p-3 text-gray-600">{row.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-gray-600">
              Хуулийн зорилгоор хадгалагдаж буй мэдээлэл нь таны бусад
              мэдээллээс тусгаарлагдаж, хатуу хандалтын хяналтаар хамгаалагдана.
              Хадгалах хугацаа дууссан даруйд энэ мэдээлэл мөн устгагдана.{" "}
            </p>
          </div>
        </div>
        {/* CONTACT */}
    
        <Section title="6. Гуравдагч талын систем дэх мэдээлэл">
          <p className="text-gray-600 whitespace-pre-line mb-4">
            Манай Апп дараах гуравдагч талын системтэй мэдээлэл хуваалцдаг. Таны
            устгах хүсэлт ирмэгц бид эдгээр системд мэдэгдэж, устгалтыг хүсэх
            болно:
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              {
                title:
                  "Аналитик үйлчилгээ үзүүлэгч (жишээ нь: Google Analytics)",
                desc: "Хэрэглэгчийн таних тэмдгийг устгана",
              },
              {
                title: "Үүлэн хадгалалтын үйлчилгээ үзүүлэгч",
                desc: "Файл болон медиа контентыг устгана",
              },
              {
                title: "Хэрэглэгчийн дэмжлэгийн платформ",
                desc: "Тасалбар болон харилцааны түүхийг устгана",
              },
              {
                title: "И-мэйл маркетингийн систем",
                desc: "Жагсаалтаас хасна, харилцааны бичлэгийг устгана",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="p-4 rounded-xl border bg-gray-50 space-y-1"
              >
                <div className="font-semibold text-gray-900">{item.title}</div>
                <div className="text-gray-600 text-sm">{item.desc}</div>
              </div>
            ))}
          </div>
          <p className="text-gray-600 mt-4">
            Гуравдагч талын системд устгалт хийгдэх хугацаа нь тухайн үйлчилгээ
            үзүүлэгчийн бодлогоос хамаарч өөр байж болно. Бид гуравдагч талын
            системд устгах хүсэлтийг 7 хоногийн дотор илгээнэ.{" "}
          </p>
        </Section>
        <Section title="7. Хэрэглэгчийн эрх">
          <p className="text-gray-600 whitespace-pre-line mb-4">
            Та мэдээлэл устгахаас гадна дараах эрхтэй: 
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              {
                title:
                  "Хандах эрх",
                desc: "Бидний танай тухай хадгалж буй мэдээллийн хуулбар хүсэх",
              },
              {
                title: "Засах эрх",
                desc: "Буруу буюу бүрэн бус мэдээллийг засахыг хүсэх",
              },
              {
                title: "Дамжуулах эрх",
                desc: "Мэдээллийг машинаар уншигдах форматаар хүлээн авах",
              },
              {
                title: "Хязгаарлах эрх",
                desc: "Боловсруулалтыг зарим хэлбэрт хязгаарлахыг хүсэх",
              },
              {
                title: "Эсэргүүцэх эрх", 
                desc: 'Маркетингийн зорилгоор ашиглахад эсэргүүцэх'
              }
            ].map((item, i) => (
              <div
                key={i}
                className="p-4 rounded-xl border bg-gray-50 space-y-1"
              >
                <div className="font-semibold text-gray-900">{item.title}</div>
                <div className="text-gray-600 text-sm">{item.desc}</div>
              </div>
            ))}
          </div>
          <p className="text-gray-600 mt-4">
            Дээрх эрхүүдийг хэрэгжүүлэхийн тулд privacy@[yourcompany.com] хаягаар холбоо барина уу. Бид баталгаажуулагдсан хүсэлтэд 30 хоногийн дотор хариу өгнө. {" "}
          </p>
        </Section>
         <Section title="8. Хариуцлага ба гүйцэтгэлийн хяналт ">
          <p className="text-gray-600 whitespace-pre-line mb-4">
            Мэдээлэл устгах журмын хэрэгжилтийг дараах байдлаар хянана: {" "}
          </p>
          <Checklist
            items={[
           "Нууцлалын Ажилтан (DPO) устгах хүсэлтүүдийн нэгдсэн бүртгэл хөтөлнө ",
          "Сар тутам устгалтын гүйцэтгэлийн тайлан гаргана ",
          "Жилд нэг удаа гуравдагч талын аудит хийлгэнэ ",
          "Meta-н шаардлагад нийцэж байгаа эсэхийг улирал тутам шалгана ",
          "Хугацаандаа биелээгүй хүсэлтийг ахлах удирдлагад мэдэгдэнэ "
            ]}
          />
        </Section>
         <Section title="9. Гомдол гаргах  ">
          <p className="text-gray-600 whitespace-pre-line mb-4">
           Мэдээлэл устгах хүсэлт хугацаандаа биелээгүй буюу бодлогын талаар гомдол байвал: 
          </p>
          <Checklist
            items={[
           "Эхлээд privacy@[yourcompany.com] хаягаар бидэнтэй холбоо барина уу ",
           "Бид 5 ажлын өдрийн дотор хариу өгч асуудлыг шийдвэрлэхийг зорино ",
           "Хэрэв хариу хангалтгүй бол Монгол Улсын Хувийн мэдээлэл хамгаалах асуудал эрхэлсэн байгууллагад гомдол гаргах боломжтой ",
           "Meta-н платформтой холбоотой гомдлыг Meta-н Тусламж Төвд (https://www.facebook.com/help) гаргаж болно "
            ]}
          />
        </Section>
         
         <Section title="11. Журамд оруулах өөрчлөлт  ">
          <p className="text-gray-600 whitespace-pre-line mb-4">
          Бид энэхүү Журамд Meta-н бодлогын өөрчлөлт, хуулийн шинэчлэлт эсвэл практикийн өөрчлөлтийг тусгахын тулд шинэчлэлт хийж болно. Томоохон өөрчлөлт хийх тохиолдолд: 
          </p>
          <Checklist
            items={[
           "Шинэчлэгдсэн журмыг хамгийн дээрт хүчинтэй огноог заан байршуулна",
           "Бүртгэлтэй хэрэглэгчдэд и-мэйлээр мэдэгдэнэ ",
           "Аппын мэдэгдлийн хэлбэрээр танд дуусгавар болгон мэдэгдэнэ "
            ]}
          />
          <p className="text-gray-600 mt-4">Журамд оруулсан өөрчлөлтийн дараа Аппыг үргэлжлүүлэн ашигласнаар та шинэчлэгдсэн Журмыг хүлээн зөвшөөрч байгаа болно. </p>
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
        icon={<Shield size={20} />}
        label="Байгууллага"
        value="Zu Nailbar"
        link
      />
      <Item
        icon={<LocationEdit size={20} />}
        label="Хаяг"
        value="БЗД, 26-р хороо, Химчан оффис 6 давхар 603 тоот "
        link
      />
      <Item
        icon={<Mail size={20} />}
        label="И-мэйл"
        value="zu.nailbar@gmail.com"
        link
      />
      <Item
        icon={<Globe size={20} />}
        label="Вэбсайт"
        value="zunailbar.mn"
        link
      />
      <Item icon={<Phone size={20} />} label="Утас" value="+976 90950605" />
      <Item
        icon={<Clock size={20} />}
        label="Ажлын цаг"
        value="Даваа–Баасан, 09:00–18:00 (УБ цаг)"
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

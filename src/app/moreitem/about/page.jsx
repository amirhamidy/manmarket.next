"use client";

import MainHeader from "@/base/mainHeader";

export default function AboutUs() {
  const docs = [
    {
      img: "/assets/img/asas.png",
      alt: "اساسنامه من مارکت",
      label: "دیدن اساسنامه من مارکت",
      href: "/api/pdf/asasname",
    },
    {
      img: "/assets/img/agahi.png",
      alt: "آگهی تاسیس من مارکت",
      label: "دیدن آگهی تاسیس من مارکت",
      href: "/api/pdf/agahi-tasis",
    },
  ];

  return (
    <div className="flex justify-center items-center flex-col ">
      <div className="w-full flex justify-end max-w-[556px]">
        <MainHeader />
      </div>
      <main
        dir="rtl"
        className="flex flex-col items-start max-w-[556px] w-full px-4 py-16 my-10"
      >

        <p className="my-2 py-2 text-gray-600 leading-8 text-sm">
          درباره من مارکت: خریدی هوشمند، مطمئن و آسان من مارکت به عنوان یکی از
          پروژه‌های کلیدی شرکت راه ابریشم نو، با هدف ارائه تجربه‌ای نوین در خرید
          آنلاین کالاهای دیجیتال و لوازم خانگی فعالیت خود را آغاز کرد. این
          فروشگاه، حاصل تجربه، دانش فنی و رویکرد نوآورانه‌ای است که در دل یک
          اکوسیستم پیشرفته شکل گرفته است.
        </p>

        <p className="my-2 py-2 text-gray-600 leading-8 text-sm">
          ما باور داریم خرید آنلاین باید تجربه‌ای ساده، مطمئن و آگاهانه باشد. از
          همین رو تلاش کرده‌ایم بستری ایجاد کنیم که مشتریان با اطلاعات دقیق،
          انتخابی مناسب داشته باشند و با آرامش خاطر خرید کنند.
        </p>

        <h5 className="my-2 py-2 text-lg font-semibold text-gray-800">
          چرا من مارکت؟
        </h5>

        {[
          "تجربه‌ای مبتنی بر اعتماد: من مارکت با تکیه بر زیرساخت‌های هوشمند و حمایت شرکت راه ابریشم نو، محیطی امن و حرفه‌ای برای خرید فراهم کرده است.",
          "تنوع در انتخاب: طیف گسترده‌ای از محصولات دیجیتال و خانگی با قیمت رقابتی و تضمین کیفیت.",
          "پشتیبانی واقعی: تیمی حرفه‌ای و پاسخ‌گو در کنار شماست تا فرآیند خرید، از انتخاب تا تحویل، بدون دغدغه انجام شود.",
          "خرید آنلاین، تحویل سریع: با مدل‌های متنوع ارسال، محصولات به‌موقع و ایمن به دست شما می‌رسند.",
        ].map((text, i) => (
          <p key={i} className="my-2 py-2 text-gray-600 leading-8 text-sm">
            {text}
          </p>
        ))}

        <h5 className="my-2 py-2 text-lg font-semibold text-gray-800">
          تعهد ما: اطمینان و رضایت مشتری
        </h5>
        <p className="my-2 py-2 text-gray-600 leading-8 text-sm">
          در من مارکت، همه‌چیز در خدمت راحتی شماست؛ از طراحی تجربه کاربری گرفته
          تا انتخاب کالاهای باکیفیت، پشتیبانی، پرداخت امن و ارسال سریع. ما برای
          هر خرید، به‌اندازه یک ارتباط بلندمدت ارزش قائلیم.
        </p>

        <h5 className="my-2 py-2 text-lg font-semibold text-gray-800">
          همگام با توسعه راه ابریشم نو
        </h5>
        <p className="my-2 py-2 text-gray-600 leading-8 text-sm">
          به‌عنوان یکی از بازوهای اجرایی شرکت راه ابریشم نو، من مارکت بخشی از یک
          اکوسیستم گسترده‌ است که در حوزه‌های تأمین مالی، زنجیره تأمین کالا،
          خدمات لجستیکی، و گردشگری کسب‌وکار فعالیت می‌کند. این پشتیبانی ساختاری،
          امکان ارائه خدمات مالی هوشمند، خرید اقساطی، و تحویل سریع را در من
          مارکت فراهم کرده است.
        </p>

        <h5 className="my-2 py-2 text-lg font-semibold text-gray-800">
          آینده روشن با همراهی شما
        </h5>
        <p className="my-2 py-2 text-gray-600 leading-8 text-sm">
          من مارکت با تیمی متعهد و حرفه‌ای، به‌دنبال توسعه مستمر خدمات خود و خلق
          تجربه‌ای متفاوت از خرید آنلاین است. ما معتقدیم آینده تجارت الکترونیک،
          از آن برندهایی است که به مشتری گوش می‌دهند و هم‌پای نیازهای او حرکت
          می‌کنند.
        </p>

        {/* Documents */}
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 py-3">
          {docs.map((doc, i) => (
            <a
              key={i}
              href={doc.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center text-gray-800 hover:opacity-80 transition-opacity p-4 border border-gray-200 rounded-xl"
            >
              <img
                src={doc.img}
                alt={doc.alt}
                className="w-1/2 object-contain"
              />
              <span className="my-3 text-sm text-center">{doc.label}</span>
            </a>
          ))}
        </div>
      </main>
    </div>
  );
}

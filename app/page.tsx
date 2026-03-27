"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";

/* ─── Data ─── */
const reviews = [
  {
    name: "Дмитрий",
    city: "Санкт-Петербург",
    rating: 5,
    text: "Пробил номер из интереса и оказалось это спам с кредитами. Теперь всегда сначала проверяю, потом уже решаю брать трубку или нет.",
    avatar: "Д",
    color: "#4A90D9",
  },
  {
    name: "Максим",
    city: "Краснодар",
    rating: 5,
    text: "По работе часто звонят с незнакомых номеров. Этот сервис помогает быстро понять кто это и не отвлекаться на лишние звонки.",
    avatar: "М",
    color: "#E67E22",
  },
  {
    name: "Екатерина",
    city: "Нижний Новгород",
    rating: 5,
    text: "Позвонили с незнакомого номера, стало подозрительно. Проверила и увидела кучу жалоб. Сразу заблокировала и не стала тратить время.",
    avatar: "Е",
    color: "#9B59B6",
  },
];

const dataSources = [
  { name: "Арбитражный суд", icon: "/assets/Emblem_of_the_Supreme_Court_of_Arbitration_of_Russia_1.svg" },
  { name: "База ФССП", icon: "/assets/New_Emblem_of_the_Federal_Bailiffs_Service.svg" },
  { name: "Федеральная Налоговая Служба", icon: "/assets/Emblem_of_the_Federal_Tax_Service_2.svg" },
  { name: "Федеральное Казначейство (ГИС ГМП)", icon: "/assets/Геральдический_знак-эмблема_Федерального_казначейства_1.svg" },
  { name: "Министерство Внутренних Дел", icon: "/assets/Emblem_of_the_Ministry_of_Internal_Affairs_1.svg" },
  { name: "Федеральная Нотариальная Палата", icon: "/assets/Emblem_of_the_Federal_Tax_Service_2-1.svg" },
  { name: "База банкротств", icon: "/assets/New_Emblem_of_the_Federal_Bailiffs_Service-1.svg" },
  { name: "Федеральная антимонопольная служба", icon: "/assets/Embllem_of_the_Federal_Antimonopoly_Service_1.svg" },
  { name: "Федеральная служба Исполнения и Наказания", icon: "/assets/Logo_of_FSIN,_Russia_1.svg" },
  { name: "Росфинмониторинг", icon: "/assets/COA_of_Rosfinmonitoring_1.svg" },
];

const howItWorks = [
  { label: "Ввод номера", text: "Введите номер и сразу запустите проверку", image: "/assets/Image.png" },
  { label: "Анализ", text: "Мы проверим номер по базам, сайтам и отзывам", image: "/assets/Image-1.png" },
  { label: "Результат", text: "Покажем, кто звонил и можно ли доверять", image: "/assets/Image-2.png" },
];

const advantages = [
  { title: "Безопасность данных", text: "Ваш номер не сохраняется и не передаётся третьим лицам", icon: "/assets/Frame-3.svg" },
  { title: "Проверка на спам и мошенников", text: "Находим жалобы, метки спама и подозрительную активность", icon: "/assets/Frame-4.svg" },
  { title: "Актуальная база", text: "Данные регулярно обновляются из разных источников", icon: "/assets/Frame-5.svg" },
  { title: "Поддержка и помощь", text: "Поможем разобраться с результатами проверки", icon: "/assets/Frame-6.svg" },
];

/* ─── Phone formatting ─── */
function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, "");
  let d = digits;
  if (d.startsWith("7") || d.startsWith("8")) d = d.slice(1);
  if (d.length === 0) return "+7 ";
  let result = "+7 ";
  if (d.length >= 1) result += d.slice(0, 3);
  if (d.length >= 4) result += " " + d.slice(3, 6);
  if (d.length >= 7) result += " " + d.slice(6, 8);
  if (d.length >= 9) result += "-" + d.slice(8, 10);
  return result;
}

function getRawDigits(formatted: string): string {
  const digits = formatted.replace(/\D/g, "");
  if (digits.startsWith("7") || digits.startsWith("8")) return digits.slice(1);
  return digits;
}

function isValidPhone(formatted: string): boolean {
  return getRawDigits(formatted).length === 10;
}

/* ─── Star component ─── */
function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-[4px] items-center">
      {Array.from({ length: 5 }).map((_, i) => (
        <Image
          key={i}
          src="/assets/Frame-1.svg"
          alt="star"
          width={14}
          height={14}
          className={i >= count ? "opacity-30" : ""}
        />
      ))}
    </div>
  );
}

/* ─── Main Page ─── */
export default function Home() {
  const [phone, setPhone] = useState("");
  const [focused, setFocused] = useState(false);
  const [touched, setTouched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef(0);
  const autoplayRef = useRef<ReturnType<typeof setInterval>>(undefined);

  const hasError = touched && phone.length > 3 && !isValidPhone(phone);

  /* Slider autoplay */
  const resetAutoplay = useCallback(() => {
    if (autoplayRef.current) clearInterval(autoplayRef.current);
    autoplayRef.current = setInterval(() => {
      setCurrentSlide((p) => (p + 1) % reviews.length);
    }, 6000);
  }, []);

  useEffect(() => {
    resetAutoplay();
    return () => { if (autoplayRef.current) clearInterval(autoplayRef.current); };
  }, [resetAutoplay]);

  /* Touch swipe */
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) setCurrentSlide((p) => (p + 1) % reviews.length);
      else setCurrentSlide((p) => (p - 1 + reviews.length) % reviews.length);
      resetAutoplay();
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    if (raw.length < 3) {
      setPhone("+7 ");
      return;
    }
    const formatted = formatPhone(raw);
    if (getRawDigits(formatted).length <= 10) {
      setPhone(formatted);
    }
  };

  const handleSubmit = () => {
    setTouched(true);
    if (!isValidPhone(phone)) return;
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Main Container */}
      <main className="flex-1 px-4 pt-4 pb-6 max-w-[600px] mx-auto w-full lg:max-w-[800px] xl:max-w-[960px]">
        {/* Header */}
        <header className="flex items-center justify-between h-[40px] mb-6">
          <div className="flex gap-[4px] items-center">
            <div className="w-[40px] h-[40px] shrink-0">
              <Image src="/assets/Logo.svg" alt="Getscam" width={40} height={40} />
            </div>
            <div className="flex flex-col items-center justify-center pb-[2px]">
              <span className="font-extrabold text-[16px] text-black whitespace-nowrap leading-none">Getscam</span>
              <span className="font-semibold text-[10px] text-black/50 leading-none">c 2013 года</span>
            </div>
          </div>
          <button className="w-[40px] h-[40px] bg-[#f2f2f2] rounded-[10px] flex items-center justify-center shrink-0">
            <Image src="/assets/Frame.svg" alt="Menu" width={24} height={24} />
          </button>
        </header>

        {/* Title */}
        <section className="mb-6">
          <h1 className="font-bold text-[20px] md:text-[28px] lg:text-[32px] text-black leading-tight">
            Неизвестный номер? Проверим
          </h1>
          <p className="font-medium text-[14px] md:text-[16px] text-black/50 mt-2">
            Узнай, кто звонил и можно ли ему доверять
          </p>
        </section>

        {/* Phone Input Block */}
        <section className="mb-6">
          <div className="bg-[#ffd945] rounded-[24px] p-3 overflow-hidden">
            <div className="px-2 mb-3">
              <span className="font-semibold text-[14px] text-black">Номер телефона</span>
            </div>

            {/* Input */}
            <div
              className={`
                flex items-center gap-2 h-[44px] rounded-[16px] px-4 transition-all duration-200
                ${hasError
                  ? "bg-red-50 ring-2 ring-red-400"
                  : focused
                    ? "bg-white ring-2 ring-black/20"
                    : "bg-white/50 hover:bg-white/70"
                }
              `}
            >
              <input
                type="tel"
                value={phone}
                onChange={handlePhoneChange}
                onFocus={() => { setFocused(true); if (!phone) setPhone("+7 "); }}
                onBlur={() => { setFocused(false); setTouched(true); }}
                placeholder="+7 800 000 00-00"
                className="flex-1 bg-transparent font-medium text-[14px] text-black placeholder:text-black/50 outline-none"
              />
              <Image src="/assets/Flag.svg" alt="RU" width={16} height={16} className="shrink-0" />
            </div>

            {hasError && (
              <p className="text-red-500 text-[12px] font-medium mt-1 px-2">
                Введите корректный номер телефона
              </p>
            )}

            {/* Buttons */}
            <div className="flex flex-col gap-2 mt-3">
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="h-[44px] bg-[#141414] rounded-[16px] flex items-center justify-center px-4 transition-all hover:bg-[#2a2a2a] active:scale-[0.98] disabled:opacity-80"
              >
                {loading ? (
                  <div className="spinner" />
                ) : (
                  <span className="font-bold text-[14px] text-white">Проверить</span>
                )}
              </button>
              <button className="h-[44px] rounded-[16px] flex flex-col items-center justify-center">
                <span className="font-bold text-[12px] text-black">Пример отчета</span>
                <div className="w-[90px] h-[1px] bg-black mt-[1px]" />
              </button>
            </div>
          </div>
          <p className="font-medium text-[12px] text-black/50 text-center mt-3">
            Нажимая «Проверить», вы подтверждаете согласие с Условиями предоставления услуги
          </p>
        </section>

        {/* Stats Row */}
        <section className="flex gap-2 mb-6">
          {[
            { value: "3.2 млн", label: "Проверенных номеров" },
            { value: "1.8 млн", label: "Найденных жалоб" },
            { value: "5 баз", label: "Источников данных" },
          ].map((stat) => (
            <div
              key={stat.value}
              className="flex-1 bg-gradient-to-b from-[#ffd945] to-[rgba(255,217,69,0)] rounded-[24px] p-3 overflow-hidden text-center"
            >
              <p className="font-bold text-[20px] md:text-[24px] text-black">{stat.value}</p>
              <p className="font-medium text-[10px] md:text-[11px] text-black/50 mt-1">{stat.label}</p>
            </div>
          ))}
        </section>

        {/* Reviews */}
        <section className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-[16px] md:text-[20px] text-black">Отзывы</h2>
            <div className="bg-[#f2f2f2] rounded-[8px] h-[20px] px-2 flex items-center justify-center">
              <span className="font-bold text-[12px] text-[#b2b2b2]">Посмотреть все</span>
            </div>
          </div>
          <div className="overflow-hidden rounded-[24px]" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
            <div
              ref={sliderRef}
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {reviews.map((review, i) => (
                <div key={i} className="w-full shrink-0">
                  <div className="bg-[#f2f2f2] rounded-[24px] pt-1 pb-3 px-1 overflow-hidden">
                    {/* User info */}
                    <div className="bg-white rounded-[20px] p-1 pr-3 flex items-center gap-3">
                      <div
                        className="w-[40px] h-[40px] rounded-[16px] shrink-0 flex items-center justify-center text-white font-bold text-[16px]"
                        style={{ backgroundColor: review.color }}
                      >
                        {review.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-bold text-[14px] text-black truncate">{review.name}</span>
                          <Stars count={review.rating} />
                        </div>
                        <p className="font-medium text-[12px] text-black/50">{review.city}</p>
                      </div>
                    </div>
                    {/* Review text */}
                    <div className="px-3 mt-1">
                      <p className="font-medium text-[12px] text-black/50 leading-[16px]">{review.text}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Slider dots */}
          <div className="flex gap-1 items-center justify-center mt-2">
            {reviews.map((_, i) => (
              <div
                key={i}
                className={`h-[6px] rounded-full transition-all duration-300 cursor-pointer ${
                  i === currentSlide ? "w-[32px] bg-black" : "w-[6px] bg-black/30"
                }`}
                onClick={() => { setCurrentSlide(i); resetAutoplay(); }}
              />
            ))}
          </div>
        </section>

        {/* Data Sources */}
        <section className="mb-6">
          <div className="bg-[#f2f2f2] rounded-[24px] p-3 overflow-hidden">
            <div className="px-3 mb-3">
              <span className="font-semibold text-[14px] text-black flex items-center gap-2">
                <span className="inline-block w-1 h-1 bg-black rounded-full" />
                Источники данных
              </span>
            </div>
            <div className="flex flex-col gap-1">
              {dataSources.map((src) => (
                <div key={src.name} className="bg-white rounded-[16px] flex items-center gap-3 px-3 py-3 hover:bg-gray-50 transition-colors cursor-pointer">
                  <Image src={src.icon} alt="" width={24} height={24} className="shrink-0" />
                  <span className="font-medium text-[12px] md:text-[13px] text-black flex-1">{src.name}</span>
                  <Image src="/assets/Frame-2.svg" alt="" width={24} height={24} className="shrink-0 opacity-50" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="mb-6">
          <h2 className="font-bold text-[16px] md:text-[20px] text-black mb-3">Как это работает?</h2>
          <div className="bg-[#f2f2f2] rounded-[24px] p-1 flex flex-col gap-1 overflow-hidden">
            {howItWorks.map((step) => (
              <div key={step.label} className="bg-white rounded-[20px] p-3 flex items-center gap-3">
                <div className="w-[60px] h-[60px] rounded-[12px] shrink-0 bg-[#ffd945] overflow-hidden relative">
                  <Image src={step.image} alt={step.label} fill className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-[12px] text-black/50">{step.label}</p>
                  <p className="font-bold text-[14px] text-black mt-1">{step.text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Advantages */}
        <section className="mb-6">
          <h2 className="font-bold text-[16px] md:text-[20px] text-black mb-3">Какие преимущества?</h2>
          <div className="flex flex-col gap-2">
            {advantages.map((adv) => (
              <div key={adv.title} className="bg-[#f2f2f2] rounded-[24px] p-3 flex items-start gap-3 overflow-hidden">
                <div className="w-[40px] h-[40px] bg-white rounded-[12px] flex items-center justify-center shrink-0">
                  <Image src={adv.icon} alt="" width={24} height={24} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-[14px] text-black">{adv.title}</p>
                  <p className="font-medium text-[12px] text-black/50 mt-1">{adv.text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="mb-6">
          <button
            onClick={scrollToTop}
            className="w-full h-[44px] bg-[#ffd945] rounded-[16px] flex items-center justify-center transition-all hover:bg-[#ffe066] active:scale-[0.98]"
          >
            <span className="font-bold text-[14px] text-black">Проверить номер</span>
          </button>
          <p className="font-medium text-[10px] text-[#b2b2b2] text-center mt-1">
            Проверка занимает 2 минуты
          </p>
        </section>
      </main>

      {/* Footer */}
      <footer className="px-4 py-6">
        <div className="bg-[#141414] rounded-[24px] p-6 max-w-[600px] mx-auto w-full lg:max-w-[800px] xl:max-w-[960px]">
          {/* Footer logo */}
          <div className="flex gap-[4px] items-center mb-6">
            <div className="w-[40px] h-[40px] shrink-0">
              <Image src="/assets/Logo.svg" alt="Getscam" width={40} height={40} />
            </div>
            <div className="flex flex-col items-center justify-center pb-[2px]">
              <span className="font-extrabold text-[16px] text-white whitespace-nowrap leading-none">Getscam</span>
              <span className="font-semibold text-[10px] text-white/50 leading-none">c 2013 года</span>
            </div>
          </div>

          {/* Links */}
          <div className="flex flex-col gap-2 mb-6">
            <span className="font-bold text-[14px] text-white">Документы</span>
            <span className="font-medium text-[14px] text-white/50 cursor-pointer hover:text-white/70 transition-colors">
              Политика конфиденциальности
            </span>
            <span className="font-medium text-[14px] text-white/50 cursor-pointer hover:text-white/70 transition-colors">
              Политика использования cookies
            </span>
          </div>

          {/* Separator */}
          <div className="h-[1px] bg-white/10 mb-6" />

          {/* Copyright */}
          <p className="font-medium text-[14px] text-white/50 text-center">
            © 2026 Getscam. Все права защищены
          </p>
        </div>
      </footer>
    </div>
  );
}

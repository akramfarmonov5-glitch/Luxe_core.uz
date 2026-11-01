# 🚀 LUXE-CORE.UZ: Saytni 0 dan To'ldirish va Ulgurji Savdo Strategiyasi

**Maqsad:** `luxe-core.uz` saytidagi eski "soat va atir" shablonini butunlay tozalab, uni `@luxe_core_uz` (92.1K obunachi) Instagram sahifasidan keladigan mijozlarni **yuqori chekli xaridorga** aylantiradigan ulgurji (B2B) va chakana-optom (B2C) platformaga aylantirish.

**Asosiy g'oya:** Loyihalar (`optombazar.uz` va `paketshop.uz`) mustaqil qoladi, lekin omboringizdagi eng xaridorgir mahsulotlar **`LUXE CORE`** brendi ostida ushbu saytga ham joylanadi. Mijoz bayram qutisi uchun kirib, yoniga paket va xo'jalik mollarini ham qo'shib oladi.

---

## 1-BOSQICH: Saytni "0" holatiga keltirish (Tozalash Check-listi)

Dasturchi yoki admin panel orqali birinchi qilinadigan 5 ta texnik ish:

1. **Test tovarlarni o'chirish:** *Rolex Datejust, Tom Ford, Chanel Bleu De Chanel* (2 ta dublikati bilan) va Unsplash rasmli 550,000 – 1,200,000 so'mlik test qutilarni bazadan butunlay o'chirish.
2. **Eski kategoriyalarni o'chirish:** *Soatlar, Sumkalar, Erkaklar parfyumeriyasi, Ko'zoynaklar* bo'limlarini olib tashlash.
3. **Bosh ekran (Hero Section) matn va rasmni yangilash:**
   * **Eski:** *"Premium tanlovlar — Soatlar, sumkalar, parfyumeriya..."*
   * **Yangi:** *"Sovg'a qutilari, Paketlar va Qadoqlash — Ulgurji Narxda"*
   * **Kichik matn:** *"To'y, Bayram va Yangi Yil 2027 qutilari, shuningdek Zip-Lock, Kraft va BOPP paketlar. O'rikzor omboridan 100 donadan boshlab 1 kunda yetkazib beramiz."*
4. **Kafolatlar blokini B2B ga moslash:**
   * *"14 kun ichida qaytarish"* $\rightarrow$ **"100 donadan ulgurji narxlar"**
   * *"2 mln so'mdan bepul yetkazish"* $\rightarrow$ **"Toshkentda 2 soatda, viloyatga 1 kunda yetkazish"**
5. **Footer (pastki qism) havolalarini to'g'rilash:**
   * Instagram ikonkasiga: `https://instagram.com/luxe_core_uz`
   * Telegram ikonkasiga: `https://t.me/Luxecoreuzbot`

---

## 2-BOSQICH: Katalog Arxitekturasi (6 ta Asosiy Kategoriya)

Saytga kirgan odam adashib qolmasligi uchun mahsulotlar **muhimlik darajasiga qarab** 6 ta kategoriyaga bo'linadi:

| Tartib | Kategoriya nomi (UZ / RU) | URL (`slug`) | Qaysi ombordan oladi? | Saytdagi ulushi |
| :--- | :--- | :--- | :--- | :--- |
| **1** | **🎄 Yangi Yil 2027 Qutilari**<br>*(Новогодняя упаковка 2027)* | `/yangi-yil-2027` | Luxe-Core | **25%** *(Noyabr-Dekabr lokomotivi)* |
| **2** | **💍 To'y va Sarpo Qutilari**<br>*(Свадебные коробки и сарпо)* | `/toy-qutilari` | Luxe-Core | **20%** *(Doimiy yuqori marjali)* |
| **3** | **🎁 Bayram va Sovg'a Qutilari**<br>*(Подарочные и крафт коробки)* | `/sovga-qutilari` | Luxe-Core | **15%** *(Do'konlar, gullar, atirlar)* |
| **4** | **🛍 Zip-Lock va Kraft Paketlar**<br>*(Крафт и Zip-Lock пакеты)* | `/kraft-zip-paketlar` | Paketshop bazasi | **15%** *(Kiyim do'konlari va marketpleyschilar)* |
| **5** | **✨ BOPP va Qadoqlash Paketlari**<br>*(БОПП пакеты и упаковка)* | `/bopp-paketlar` | Paketshop bazasi | **15%** *(Ommaviy kundalik ulgurji)* |
| **6** | **☕ HoReCa va Xo'jalik Ulgurji**<br>*(HoReCa и хозтовары оптом)* | `/horeca-xojalik` | Optombazar bazasi | **10%** *(Qo'shimcha chek oshiruvchi)* |

---

## 3-BOSQICH: Narxlash va Tovar Kartochkasi Strategiyasi (Eng muhim nuqta!)

Ulgurji saytda mijozni cho'chitib yubormaslik va shu bilan birga 1 dona quti so'raydigan chakana xaridorlarga vaqt yo'qotmaslik uchun **"3 pog'onali narx"** qoidasi ishlatiladi:

### Har bir tovar kartochkasida bo'lishi shart bo'lgan 4 ta element:
1. **Asosiy ko'rinadigan narx:** 1 dona mahsulotning ulgurji narxi (masalan: **`2 800 UZS`** — *550 000 UZS emas!*).
2. **Minimal buyurtma belgisi (Badge):** Rasm burchagida yoki narx ostida: `📦 Min. buyurtma: 100 dona` (yoki `1 pachka = 100 dona`).
3. **Tavsif ichida hajmiy chegirma jadvali:**
   * 100 – 499 dona: **6,500 so'm**
   * 500 – 999 dona: **5,800 so'm**
   * 1000+ dona: **5,000 so'm**
4. **Aniq xususiyatlar (o'lcham):** Uzunligi $\times$ Eni $\times$ Balandligi ($\text{sm}$ da) yoki qalinligi ($\text{mkm}$ da).

---

## 4-BOSQICH: Birinchi haftada kiritiladigan TOP-30 Mahsulot Rejasi

Sayt to'la va ishonchli ko'rinishi uchun har bir kategoriyaga **5 tadan eng ko'p sotiladigan (xit) tovarni** kiritamiz (jami 30 ta tovar — 2 kunda kiritib bo'linadi):

### 1. 🎄 Yangi Yil 2027 Qutilari (5 ta xit)
1. **Bolalar shirinlik qutisi "Qor Bobo 2027" (Tutqichli karton, 1 kg)** — *2,800 so'm (Min: 100 dona)*
2. **Bolalar shirinlik qutisi "Archa" (Katta hajm, 1.5 – 2 kg)** — *4,200 so'm (Min: 100 dona)*
3. **Korporativ VIP Yangi Yil qutisi (Qattiq karton, tilla lentali)** — *12,000 so'm (Min: 50 dona)*
4. **Shaffof darchali Yangi Yil Kraft qutisi (Pishiriq va to'plamlar uchun)** — *4,800 so'm (Min: 100 dona)*
5. **Yangi Yil laminatsiyali sovg'a paketi (Ip tutqichli, M/L o'lcham)** — *3,200 so'm (Min: 100 dona)*

### 2. 💍 To'y va Sarpo Qutilari (5 ta xit)
6. **Magnitli Premium Oq Quti (Atlas lentali, $25 \times 20 \times 10\text{ sm}$)** — *14,500 so'm (Min: 50 dona)*
7. **Kuyov-Kelin Sarpo Qutilari 3 talik To'plami (S, M, L)** — *32,000 so'm (Min: 30 to'plam)*
8. **Milliy tilla naqshli To'y shirinlik/patir qutisi** — *5,500 so'm (Min: 100 dona)*
9. **Qaymoqrang (Krem) qopqoqli qattiq sarpo qutisi ($30 \times 25 \times 12\text{ sm}$)** — *16,000 so'm (Min: 50 dona)*
10. **To'y sovg'alari uchun tilla hoshiyali premium qog'oz paket** — *3,500 so'm (Min: 100 dona)*

### 3. 🎁 Bayram va Sovg'a Qutilari (5 ta xit)
11. **Atir va kosmetika uchun vertikal lentali quti** — *6,500 so'm (Min: 100 dona)*
12. **Shaffof oynali (darchali) Eko-Kraft quti ($20 \times 20 \times 8\text{ sm}$)** — *4,500 so'm (Min: 100 dona)*
13. **Soat va taqinchoqlar uchun yostiqchali mini quti** — *5,000 so'm (Min: 100 dona)*
14. **Dumaloq (Silindr) gul va sovg'a qutisi** — *18,000 so'm (Min: 30 dona)*
15. **Quti ichiga solinadigan dekorativ qog'oz to'ldiruvchi (Strujka / Tishyu)** — *15,000 so'm / qadoq*

### 4. 🛍 Zip-Lock va Kraft Paketlar (5 ta xit)
16. **Burama qog'oz tutqichli Qo'ng'ir Kraft paket ($25 \times 32 \times 11\text{ sm}$)** — *1,800 so'm (Min: 100 dona)*
17. **Oq Kraft paket (Butik va sovg'a do'konlari uchun, $25 \times 32 \times 11\text{ sm}$)** — *2,200 so'm (Min: 100 dona)*
18. **Matoviy Zip-Lock paket havo klapani bilan (Kiyim uchun, $30 \times 40\text{ sm}$)** — *950 so'm (1 pachka = 100 dona)*
19. **Shaffof yugurdakli (begunokli) Zip-Lock paket ($25 \times 35\text{ sm}$)** — *850 so'm (1 pachka = 100 dona)*
20. **Yelimli kuryer paketi (Uzum/Wildberries sotuvchilari uchun, $30 \times 40\text{ sm}$)** — *650 so'm (1 pachka = 100 dona)*

### 5. ✨ BOPP va Qadoqlash Paketlari (5 ta xit)
21. **Yelimli (kleyevoy klapanli) BOPP paket ($10 \times 15\text{ sm}$ — suvenir/aksessuar)** — *65 so'm (Qadoqda: 1000 dona)*
22. **Yelimli BOPP paket ($20 \times 30\text{ sm}$ — shirinlik va trikotaj)** — *180 so'm (Qadoqda: 500 dona)*
23. **Yelimli BOPP paket ($30 \times 40\text{ sm}$ — ko'ylak va tekstil)** — *320 so'm (Qadoqda: 500 dona)*
24. **Qalin qadoqlash skotchi (Shaffof / Jigarrang, $45\text{ mm} \times 100\text{ m}$)** — *8,500 so'm (Blokda: 6 dona)*
25. **Ombor va yuklar uchun Strich-plyonka ($50\text{ sm}$, $2\text{ kg}$)** — *42,000 so'm / rulon*

### 6. ☕ HoReCa va Xo'jalik Ulgurji (5 ta xit)
26. **Ikki qavatli (Double Wall) kofe stakani ($250\text{ ml}$ / $350\text{ ml}$ + qopqoq)** — *750 so'm (Min: 500 dona)*
27. **Burger va Fast-Food uchun yog' o'tkazmaydigan kraft quti** — *850 so'm (Min: 500 dona)*
28. **Issiq taomlar uchun qopqoqli qora konteyner ($750\text{ ml}$)** — *1,100 so'm (Qadoqda: 300 dona)*
29. **Qora nitril qo'lqoplar (Oshxona va qandolatchilar uchun, M/L)** — *38,000 so'm (Qutida: 100 dona)*
30. **Mustahkam chiqindi (musor) paketlari ($120\text{ L}$ / $200\text{ L}$)** — *11,500 so'm / rulon (Qadoqda: 20 rulon)*

---

## 5-BOSQICH: Sotuv Voronkasi va 7 Kunlik Ishga Tushirish Rejasi

Saytga kirgan mijozni yo'qotmaslik uchun xarid jarayoni maksimal sodda bo'lishi kerak:
* **Savat orqali 1-klikda buyurtma:** Mijoz faqat **Ismi**, **Telefon raqami** va **Soni (100/500/1000)** ni kiritadi $\rightarrow$ Buyurtma darhol sizning Telegram admin guruhingizga tushadi.

### 📅 7 Kunlik Amaliy Reja:
* **1-kun (Bugun):** Sayt bazasidagi eski soat va atirlarni 0 ga tushirish, 6 ta yangi kategoriyani yaratish.
* **2-kun:** Birinchi 10 ta tovarni (Yangi Yil 2027 va To'y qutilarini) chiroyli rasmlari va ulgurji narxlari bilan saytga joylash.
* **3-kun:** Keyingi 10 ta tovarni (Sovg'a qutilari, Kraft va Zip-Lock paketlarni) saytga kiritish.
* **4-kun:** Oxirgi 10 ta tovarni (BOPP paketlar va HoReCa mahsulotlarini) kiritish hamda Bosh sahifa (Hero, Footer) matnlarini yangilash.
* **5-kun:** Saytdan test buyurtma berib ko'rish, mobil versiyada (telefon ekranida) barcha narxlar va tugmalar to'g'ri chiqishini tekshirish.
* **6-kun:** Instagram `@luxe_core_uz` sahifasida tayyorlangan karusellarni joylash va Stories'da **"Yangi saytimiz luxe-core.uz ishga tushdi — Yangi Yil 2027 katalogi saytda!"** deb e'lon berish.
* **7-kun:** Saytga Google Search Console va Yandex Metrika ulash (qaysi tovarlarni odamlar ko'proq ko'rayotganini kuzatish uchun).
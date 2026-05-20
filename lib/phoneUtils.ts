/**
 * Telefon raqamini standard formatga va faqat raqamlardan iborat ko'rinishga keltiradi (+998901234567)
 * @param phone Telefon raqami
 */
export const formatPhoneNumber = (phone: string): string => {
  if (!phone) return '';
  // Faqat raqamlarni qoldiramiz
  const digits = phone.replace(/\D/g, '');
  
  // Agar raqam 9 ta bo'lsa (masalan 901234567), boshiga +998 qo'shamiz
  if (digits.length === 9) {
    return `+998${digits}`;
  }
  
  // Agar raqam 12 ta bo'lsa va 998 bilan boshlansa, boshiga + qo'shamiz
  if (digits.length === 12 && digits.startsWith('998')) {
    return `+${digits}`;
  }
  
  // Aks holda raqam qanday bo'lsa, agar boshida + bo'lsa shunday, bo'lmasa + qo'shib qaytaramiz
  return phone.startsWith('+') ? phone : `+${digits || phone}`;
};

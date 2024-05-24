export const generateUnitUserName = (): string => {
  const maleNames = [
    "Valto Bizu",
    "Zapris Hlel",
    "Sinkmire Winglace",
    "Hakir Elisor",
    "Mapitu Uldan",
    "Aetes Shangueiros",
    "Nemesion Balgran",
    "Garffon Lisalor",
    "Golash Aena",
    "Alistair al Pair",
    "Sasgix Eranal",
    "Petrosque Quinal",
    "Laegon Umeran",
    "Hersperon Oderle",
    "Callister Grafft",
    "Zangard Kaalin",
    "Xernes Adafin",
    "Xanus Elhora",
    "Alistair Chapira",
    "Salvestro Elmaris",
    "Elusidor Riecto",
    "Usir Lierin",
    "Golash Yosalr",
  ]

  return maleNames[Math.floor(Math.random() * maleNames.length)]
}

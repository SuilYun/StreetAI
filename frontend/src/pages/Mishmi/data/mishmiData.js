// Structured cultural data about the Mishmi Tribe of Arunachal Pradesh
export const mishmiData = {
  hero: {
    title: "Mishmi",
    subtitle: "Guardians of the Eastern Himalayas",
    description: "An ancient tribe nestled in the mist-laden valleys of Arunachal Pradesh, keeping watch over pristine forests and sacred rivers since time immemorial.",
  },
  history: {
    title: "History and Origin",
    introduction: "The Mishmi people comprise one of the major tribal groups of Arunachal Pradesh, occupying the northeast corner of the state. With a heritage deeply intertwined with the rugged mountains, their history is passed down through rich oral narratives, folk songs, and legends.",
    details: [
      "The origin of the Mishmi people is traced back to ancestral migrations from Tibet and Yunnan, China, centuries ago. Moving through the mountain passes of the Eastern Himalayas, they settled in the valleys of the Dibang, Lohit, and Anjaw districts.",
      "Early historical accounts, including medieval records and British administrative journals, describe the Mishmi as independent, formidable mountain keepers who controlled vital trade routes between Assam, Tibet, and Burma.",
      "The legendary ancestor of the Mishmis is believed to be 'Inyitaya' or 'Shato', who taught their ancestors the arts of agriculture, house construction, and weaving. Today, they remain guardians of these ancient traditions, maintaining a harmonious relationship with their environment."
    ],
    quote: "We do not own the forest; we are its guardians, and the mountains are our ancestors' spirits.",
    quoteAuthor: "Idu Mishmi Elder"
  },
  subTribes: [
    {
      id: "idu",
      name: "Idu Mishmi",
      alternativeName: "Chulikata",
      population: "~12,000",
      regions: "Dibang Valley & Lower Dibang Valley",
      description: "Known for their distinct crop haircut (historically referred to as 'Chulikata' by plains people), the Idu Mishmi are famous for their profound spiritual practices led by shamans (Igu), their master weaving skills, and their deep-rooted taboos that protect local wildlife like the Tiger.",
      features: ["Distinctive crop haircut style", "Shamanic rituals led by 'Igu'", "Strong taboos protecting tigers as brothers", "Imposing stone and wood architecture"],
      image: "/mishmi/idu_tribe.png"
    },
    {
      id: "digaru",
      name: "Digaru Mishmi",
      alternativeName: "Taraon",
      population: "~10,000",
      regions: "Lohit & Anjaw Districts",
      description: "Also called the Taraon, the Digaru Mishmi share close cultural ties with the Miju. They are exceptional traders and agriculturalists, known for their longhouses and high-quality weaving. Their women wear elaborate silver ornaments including large circular ear-plugs.",
      features: ["Traditional long silver pipe smoked by elders", "Circular silver ear ornaments ('Apre')", "Elaborate multi-family bamboo longhouses", "Pioneers of cardamom cultivation"],
      image: "/mishmi/digaru_tribe.png"
    },
    {
      id: "miju",
      name: "Miju Mishmi",
      alternativeName: "Kaman",
      population: "~18,000",
      regions: "Anjaw & Lohit Districts",
      description: "The Miju, or Kaman Mishmi, reside further east along the Lohit river valley up to the border regions. Famous for their colorful textiles, intricate handlooms, and deep connection to nature. They are traditional animists worshipping supreme deities like 'Matai'.",
      features: ["Vibrant red and black geometric weaves", "Belief in 'Matai' as the creator deity", "Extensive usage of large silver hairpins", "Deep forest foraging traditions"],
      image: "/mishmi/miju_tribe.png"
    }
  ],
  geography: {
    title: "Geographic Distribution",
    description: "The Mishmi Tribe primarily resides in the mountainous northeastern tip of Arunachal Pradesh, bordering Tibet to the north and Myanmar to the east. Their homeland spans across four scenic, river-cut districts.",
    districts: [
      { name: "Dibang Valley", coordinates: [28.8, 95.8], description: "Homeland of the Idu Mishmi. The least densely populated district in India, characterized by deep valleys and snow-clad peaks.", resides: "Idu Mishmi" },
      { name: "Lower Dibang Valley", coordinates: [28.2, 95.7], description: "Foothill and valley regions where the Dibang River enters the plains. Home to mixed communities.", resides: "Idu Mishmi" },
      { name: "Lohit", coordinates: [27.9, 96.2], description: "Centered around the holy Lohit River. A land of fertile plains and mist-covered hills.", resides: "Digaru & Miju Mishmi" },
      { name: "Anjaw", coordinates: [28.0, 96.8], description: "Residing along the international border. A mountainous landscape rich in pine forests and alpine meadows.", resides: "Miju & Digaru Mishmi" }
    ]
  },
  dress: {
    title: "Traditional Dress & Ornaments",
    description: "Mishmi attire is a visual storyteller of their identity, showcasing intricate geometric patterns, organic dyes, and elaborate silver and bead ornaments.",
    elements: [
      {
        title: "Idu Mishmi Attire",
        description: "Men wear a sleeveless coat ('Togo') woven of nettle fiber and cotton, decorated with beautiful geometric designs, often paired with a woven cane helmet ('Apapa'). Women wear a wrap-around skirt ('Thoba') and a black jacket, complemented by silver headbands.",
        image: "/mishmi/dress.png"
      },
      {
        title: "Ornaments and Accents",
        description: "Silver plays a huge role. Women wear a thin silver band ('Arua') on their foreheads, large silver ear plugs ('Apre'), and heavy necklaces of beads and silver coins. Men carry a beautifully crafted 'Dao' (machete) slung across their chest in a decorated wooden sheath.",
        image: "/mishmi/weaving.png"
      }
    ]
  },
  festivals: [
    {
      name: "Reh Festival",
      tribe: "Idu Mishmi",
      date: "February 1 - 3",
      image: "/mishmi/reh_festival.jpg",
      description: "Reh is the most important festival of the Idu Mishmi, celebrated for peace, prosperity, and a bountiful harvest. It is a grand socio-religious event dedicated to the mother goddess 'Nanyi Inyitaya'.",
      rituals: [
        "Led by the Igu (shaman) who chants ancestral tales and performs mystical dances.",
        "Offering of locally brewed rice beer ('Yu') and traditional foods.",
        "The ritualistic slaughter of mithun to seek blessings for the family and clan.",
        "Grand feast where relatives gather from distant villages to cement bonds."
      ]
    },
    {
      name: "Tamladu Festival",
      tribe: "Digaru & Miju Mishmi",
      date: "February 15",
      image: "/mishmi/tamladu_festival.jpg",
      description: "Tamladu is celebrated by the Digaru (Taraon) and Miju (Kaman) tribes. It is a prayer offered to the Almighty 'Matai' and 'Jebmalu' (god of nature) for protection from natural calamities, diseases, and for agricultural success.",
      rituals: [
        "Erection of sacred altars made of bamboo and leaves in the center of the village.",
        "Prayers to the deities of Earth, Water, Wind, and Mountains.",
        "Performance of the colorful traditional dance 'Tangong' by youth.",
        "Community feasts featuring traditional boiled tubers, smoked meats, and rice beer."
      ]
    }
  ],
  lifestyle: {
    title: "Lifestyle & Occupation",
    description: "The lifestyle of the Mishmis is heavily modeled around the mountainous environment, reflecting sustainable resource management developed over centuries.",
    items: [
      {
        title: "Jhum Cultivation",
        description: "Traditional shifting cultivation on mountain slopes. They grow rice, millet, maize, and vegetables, using eco-friendly traditional practices.",
        icon: "Leaf"
      },
      {
        title: "Mithun Rearing",
        description: "The Mithun (Bos frontalis) is the most valuable semi-domesticated animal for the Mishmi, representing wealth, status, and spiritual significance.",
        icon: "ShieldAlert"
      },
      {
        title: "Forest Foraging",
        description: "Deep knowledge of the forests allows them to gather wild mushrooms, edible roots, medicinal plants (like Mishmi Teeta), and bamboo shoots.",
        icon: "Trees"
      },
      {
        title: "Bamboo Craftsmanship",
        description: "Bamboo and cane are central to lifestyle. Houses, bridges, utensils, mats, and baskets are expertly woven from these versatile grasses.",
        icon: "Hammer"
      }
    ]
  },
  languages: {
    title: "Languages and Dialects",
    description: "The Mishmi speak languages belonging to the Tibeto-Burman family. There are three distinct dialects corresponding to the sub-tribes: Kaman (Miju), Taraon (Digaru), and Idu.",
    vocab: [
      { word: "Hello / Greetings", idu: "Ayu", digaru: "Kaba-a", miju: "Kha-mo" },
      { word: "Water", idu: "Machu", digaru: "Kha", miju: "Kla" },
      { word: "Sun", idu: "Elha", digaru: "Kamui", miju: "Kammi" },
      { word: "Thank You", idu: "Ayu-ge", digaru: "Ru-ba", miju: "Ka-ru-ma" },
      { word: "House", idu: "Anda", digaru: "Sang", miju: "Khim" },
      { word: "Tiger", idu: "Aba-Ami (Brother)", digaru: "Kosa", miju: "Kusa" }
    ]
  },
  musicDance: {
    title: "Music and Folk Dance",
    description: "Dances and songs are performance-oriented forms of storytelling. They accompany major agricultural cycles, shamanic healing rituals, and community festivals.",
    items: [
      {
        title: "Shamanic Dance (Igu Dance)",
        description: "Performed by the Idu Mishmi shaman (Igu). Dressed in ceremonial robes with shells, brass bells, and a headpiece, the shaman beats a drum ('Tambre') and dances in a trance-like state to invoke guardian spirits and heal the sick.",
        image: "/mishmi/igu_dance.png"
      },
      {
        title: "Tangong Dance",
        description: "A joyous community dance performed by the Digaru and Miju youth during Tamladu. Dancers form circular chains, holding hands, moving gracefully to the beats of gongs, drums, and wind instruments.",
        image: "/mishmi/tangong_dance.png"
      },
      {
        title: "Folk Instruments",
        description: "Mishmi instruments are organic. They include bamboo flutes, jew's harps ('Kungki'), bronze gongs ('Ahing'), and single-headed drums ('Tambre'). The metallic tone of gongs is highly valued.",
        image: "/mishmi/weaving.png"
      }
    ]
  },
  cuisine: [
    {
      name: "Smoked Mithun Meat",
      description: "Meat is preserved by smoking it over the central hearth of the longhouse, imparting a rich, woody flavor. It is cooked simply with wild ginger and chilies.",
      image: "/mishmi/mithun_meat.jpg",
      tag: "Signature Dish"
    },
    {
      name: "Dun (Bamboo Rice)",
      description: "Sticky local rice cooked inside hollow bamboo tubes over hot ashes. The sticky texture absorbs the delicate lining of the bamboo, giving it a unique aroma.",
      image: "/mishmi/bamboo_rice.jpeg",
      tag: "Staple"
    },
    {
      name: "Mishmi Yu (Rice Beer)",
      description: "A traditional fermented beverage made from millet or rice. Brewed in every home, it represents hospitality and is offered to guest and deities alike.",
      image: "/mishmi/rice_beer_generated.png",
      tag: "Traditional Drink"
    }
  ],
  religion: {
    title: "Spiritual Beliefs & Animism",
    description: "The Mishmi practice a unique form of animism. They believe that nature is alive with spirits—both benevolent and malevolent—residing in mountains, rivers, and old-growth trees.",
    details: [
      "Idu Mishmis worship Nanyi Inyitaya as the mother creator, while the Miju and Digaru look to Matai and Jebmalu as supreme protectors.",
      "The Tiger holds a sacred place. Idu legends state that the Tiger and the Mishmi are brothers born of the same mother. Killing a tiger is considered a sin comparable to fratricide, requiring deep cleansing rituals led by the shaman.",
      "Shamanism is the cornerstone of their belief. The shaman acts as a medium between the human realm and the spirit world, interpreting dreams, performing sacrifices, and restoring spiritual balance."
    ]
  },
  floraFauna: {
    title: "Flora and Fauna",
    description: "Living in the Indo-Burma biodiversity hotspot, the Mishmi hills harbor thousands of rare, endemic species of orchids, medicinal herbs, and animals.",
    items: [
      {
        name: "Mishmi Takin",
        scientificName: "Budorcas taxicolor taxicolor",
        description: "A rare, stocky mountain mammal adapted to rugged slopes. Protected as a sacred animal by the local tribes, who prevent its overhunting.",
        image: "/mishmi/takin.png"
      },
      {
        name: "Mishmi Teeta",
        scientificName: "Coptis teeta",
        description: "A highly prized medicinal herb endemic to the Mishmi hills. Used traditionally to cure fevers, dysentery, and inflammation, it is highly threatened.",
        image: "/mishmi/mishmi_teeta.png"
      },
      {
        name: "Sclater's Monal",
        scientificName: "Lophophorus sclateri",
        description: "A brilliantly colored pheasant found in alpine meadows and rocky peaks of Anjaw and Dibang Valley. Known for its dazzling iridescent feathers.",
        image: "/mishmi/hero.png"
      }
    ]
  },
  timeline: [
    { year: "Pre-History", title: "Ancestral Migration", desc: "Migration from southwestern China/Tibet into the valleys of Arunachal Pradesh." },
    { year: "1827", title: "First British Contact", desc: "British explorer Wilcox becomes the first outsider to record the Lohit Mishmi settlements." },
    { year: "1854", title: "The Krick & Bourry Incident", desc: "French missionaries Father Krick and Father Bourry are killed while crossing Mishmi territory, leading to British military expeditions." },
    { year: "1914", title: "McMahon Line", desc: "Creation of the McMahon Line defining the border with Tibet, placing Mishmi hills in British India." },
    { year: "1950", title: "Great Assam Earthquake", desc: "A massive 8.6 magnitude earthquake shifts the topography, triggering landslides across the Mishmi hills." },
    { year: "2018", title: "Dibang Tiger Reserve Recognition", desc: "Highlighting the Idu Mishmi community-led tiger conservation efforts, demonstrating how taboos successfully protect apex predators." }
  ],
  funFacts: [
    { count: 4, label: "River Districts", suffix: "" },
    { count: 120, label: "Weaving Patterns", suffix: "+" },
    { count: 40000, label: "Total Population", suffix: "" },
    { count: 3, label: "Sub-tribes", suffix: "" }
  ],
  funFactTexts: [
    "Idu Mishmis believe that killing a tiger is a sin because the tiger is their older brother.",
    "A typical Mishmi longhouse can be up to 100 feet long, housing multiple generations of a family.",
    "Mishmi women are considered among the finest weavers in the Eastern Himalayas, producing textiles that can last decades.",
    "The legendary medicinal plant 'Coptis Teeta' grows only in high-altitude shade in this specific mountain range."
  ],
  amewa: {
    title: "All Mishmi Economy Welfare Association (AMEWA)",
    established: "26th October 1997",
    registrationNo: "SR/ITA/718/00",
    headOffice: "Tezu, Lohit District, Arunachal Pradesh, PIN: 792001",
    storeMuseum: {
      name: "Handloom, Handicrafts & Millets Store Cum Museum",
      address: "Chaitom Complex Near APMC, Tezu / Opposite IGG College Tezu",
      description: "A community-led center promoting local economy and conserving traditional Mishmi heritage. It showcases authentic handwoven textiles, organic millet grains, and masterfully crafted cane and bamboo objects directly sourced from native artisans."
    }
  },
  craftsShowcase: {
    handlooms: [
      {
        name: "Thoba (Traditional Wrap-around)",
        description: "A finely woven wrap-around skirt featuring intricate geometric patterns. Sourced from backstrap looms, representing centuries of female weaving heritage.",
        tag: "Women's Attire",
        highlights: "Organic dyes, geometric panels, extra warp technique"
      },
      {
        name: "Togo (Sleeveless Coat)",
        description: "Worn by Mishmi men, woven from natural nettle fiber and cotton. It features bold red, black, and white lines with stylized geometric border embroidery.",
        tag: "Men's Attire",
        highlights: "Nettle fiber base, durable texture, traditional motifs"
      },
      {
        name: "Woven Shoulder Bag (Pom-Pom Bag)",
        description: "Vibrant pink and red sling bags adorned with woolen pom-poms, widely carried as an iconic accessory across all Mishmi sub-tribes.",
        tag: "Accessory",
        highlights: "Detailed cross-stitching, robust strap, aesthetic tassels"
      }
    ],
    bambooCane: [
      {
        name: "Boolup (Cane Helmet)",
        image: "/mishmi/craft_boolup.jpg",
        description: "A dome-shaped, impact-resistant helmet woven from split cane. Historically used in warfare and ceremonies, representing master craftsmanship.",
        tag: "Traditional Headgear",
        highlights: "Closed weave, high structural strength, lightweight"
      },
      {
        name: "Thee (Carrying Basket)",
        image: "/mishmi/craft_basket.jpg",
        description: "A tapering agricultural basket used for harvesting crops. It features a unique flat bamboo base stand secured by strong cane bindings.",
        tag: "Harvest Utility",
        highlights: "Twill weave pattern, reinforced frame, flat wooden stand"
      },
      {
        name: "Epum (Storage & Utility Basket)",
        image: "/mishmi/craft_epum.jpg",
        description: "A heavy-duty carrying and storage basket with four bamboo stalks forming supporting legs at the base corners, designed for firewood and grain storage.",
        tag: "Household Storage",
        highlights: "Thick split bamboo stalks, open-work pattern, sturdy build"
      },
      {
        name: "Dao Sheath (Knife Holder)",
        image: "/mishmi/craft_dao_sheath.jpg",
        description: "A half-open sheath for carrying the traditional Dao machete. Platted with fine split cane to provide durability and prevent injury.",
        tag: "Personal Tool Holder",
        highlights: "Plaited split cane, decorated back, waist-belt attachment"
      },
      {
        name: "Dun (Cooking Tube)",
        image: "/mishmi/craft_dun.jpg",
        description: "Freshly cut hollow green bamboo tubes used for steaming rice and fish over open wood fires. Infuses the food with a delicate sweet bamboo aroma.",
        tag: "Culinary Utensil",
        highlights: "Natural single-use vessel, heat-resistant green bamboo"
      }
    ],
    milletsProduce: [
      {
        name: "Local Millets (Foxtail & Finger)",
        description: "Sustainably harvested from Jhum (shifting cultivation) slopes. Millets represent nutritional resilience and are crucial for festival food preparations.",
        tag: "Traditional Grain",
        highlights: "Organic farming, drought-resilient, source of iron and calcium"
      },
      {
        name: "Buckwheat (High-Altitude Harvest)",
        description: "Grown in high-altitude valleys, actively promoted by AMEWA as an alternative cash crop to uplift the rural economy of Mishmi farmers.",
        tag: "Agricultural Crop",
        highlights: "Cold-tolerant, gluten-free, key economic booster"
      },
      {
        name: "Mishmi Yu (Fermented Brew)",
        description: "Traditional beverage brewed using local millet and rice starter cakes. Fermented in bamboo tubes and served during community gatherings.",
        tag: "Traditional Beverage",
        highlights: "Natural fermentation, organic ingredients, cultural toast"
      }
    ]
  },
  references: [
    "Verrier Elwin, 'Myths of the North-East Frontier of India', 1958.",
    "District Census Handbooks of Dibang Valley & Lohit, Government of India.",
    "A. Mackenzie, 'History of the Relations of the Government with the Hill Tribes of the North-East Frontier of Bengal', 1884.",
    "Community Conservation studies on Idu Mishmi and Dibang Tiger Reserve, Wildlife Institute of India."
  ]
};

import React, { useState, useEffect, useRef } from "react";
import PhoneInput from "react-phone-input-2"; //
import "react-phone-input-2/lib/style.css";
import { Sun, Moon } from "lucide-react";
import {
  initBLE,
  startAdvertising,
  startScanning,
  stopScanning,
  connectAndGetIdentity,
  sendBLEMessage,
  subscribeToMessages,
  isNativePlatform,
} from "./bluetoothService";

// Emoji keywords mapping for search functionality
// Allows users to search for emojis using descriptive keywords
const EMOJI_KEYWORDS = {
  // Smileys & People
  "😀": "happy grinning smile laugh face",
  "😃": "happy big smile grin open mouth",
  "😄": "happy laugh smile grin joy",
  "😁": "grin beaming smile happy excited",
  "😆": "laughing happy grin squinting",
  "😅": "sweat smile nervous awkward relief",
  "😂": "joy tears laugh crying funny",
  "🤣": "rolling laugh floor funny rofl",
  "😊": "blush smile happy warm friendly",
  "😇": "angel halo innocent smile",
  "🙂": "slight smile happy calm",
  "🙃": "upside down silly sarcastic smile",
  "😉": "wink smile flirt playful",
  "😌": "relieved calm peaceful happy",
  "😍": "heart eyes love adore beautiful crush",
  "🥰": "smiling hearts love cute affection",
  "😘": "kiss face love blow kiss",
  "😗": "kiss whistling pucker",
  "😙": "kiss smile happy",
  "😋": "yum delicious savoring tongue food",
  "😛": "tongue out playful silly",
  "😝": "tongue squinting silly playful",
  "😜": "wink tongue playful zany",
  "🤪": "zany crazy silly goofy wacky",
  "🤨": "raised eyebrow skeptical suspicious",
  "🧐": "monocle curious smart sophisticated",
  "🤓": "nerd glasses smart studious",
  "😎": "cool sunglasses awesome confident",
  "🥸": "disguise nose glasses incognito",
  "🤩": "star struck excited amazing wow",
  "🥳": "party celebrate birthday woo",
  "😏": "smirk confident flirty sly",
  "😒": "unamused annoyed bored unimpressed",
  "😞": "disappointed sad unhappy let down",
  "😔": "pensive sad thoughtful down",
  "😟": "worried concerned sad anxious",
  "😕": "confused unsure uncertain sad",
  "🙁": "frowning sad unhappy disappointed",
  "☹️": "frown sad unhappy displeased",
  "😣": "persevere struggling hard difficult",
  "😖": "confounded frustrated tired",
  "😫": "tired exhausted weary",
  "😩": "weary tired frustrated",
  "🥺": "pleading puppy eyes sad beg",
  "😢": "cry sad tear single tear",
  "😭": "crying sob tears sad wail",
  "😤": "triumph steam nose frustrated angry",
  "😠": "angry mad frown upset",
  "😡": "rage angry pouting furious",
  "🤬": "swearing cursing rage angry symbols",
  "🤯": "mind blown exploding head shocked",
  "😳": "flushed embarrassed shocked wide eyes",
  "🥵": "hot sweat fever overheated",
  "🥶": "cold frozen freezing blue face",
  "😱": "scream fear shocked horror",
  "😨": "fearful scared worried anxious",
  "😰": "anxious sweat nervous worried",
  "😥": "sad sweat relieved disappointed",
  "😓": "downcast sweat effort hard",
  "🤗": "hug hugging warm happy embrace",
  "🤔": "thinking pondering curious question",
  "🤭": "hand mouth giggle surprised oops",
  "🤫": "shush quiet secret whisper",
  "🤥": "lying pinocchio nose",
  "😶": "no mouth silent speechless",
  "😐": "neutral expressionless blank",
  "😑": "expressionless blank emotionless",
  "😬": "grimace nervous awkward teeth",
  "🙄": "eye roll annoyed bored whatever",
  "😯": "hushed surprised quiet",
  "😦": "frowning open mouth worried",
  "😧": "anguished distressed panicked",
  "😮": "open mouth surprised astonished",
  "😲": "astonished shocked surprised gasp",
  "🥱": "yawn tired sleepy bored",
  "😴": "sleeping sleep snore zzz",
  "🤤": "drool hungry sleepy",
  "😪": "sleepy tired drowsy",
  "😵": "dizzy dead eyes spinning confused",
  "🤐": "zipper mouth secret quiet",
  "🥴": "woozy drunk dizzy unwell",
  "🤢": "nauseated sick gross green",
  "🤮": "vomit sick disgusted",
  "🤧": "sneeze sick cold allergy",
  "😷": "mask sick medical face",
  "🤒": "thermometer sick fever ill",
  "🤕": "bandage hurt injured pain",
  "🤑": "money mouth rich greedy dollar",
  "🤠": "cowboy hat western yeehaw",
  "😈": "devil smiling evil mischievous",
  "👿": "angry devil evil bad",
  "👹": "ogre demon monster japanese",
  "👺": "goblin tengu japanese mask",
  "🤡": "clown circus creepy joker",
  "💩": "poop shit turd funny",
  "👻": "ghost spooky halloween boo",
  "💀": "skull death dead bones",
  "👽": "alien extraterrestrial ufo space",
  "👾": "alien monster game pixel",
  "🤖": "robot android mechanical",
  "😺": "cat smile happy",
  "😸": "cat grin happy",
  "😹": "cat laugh tears joy",
  "😻": "cat heart eyes love",
  "😼": "cat smirk sly",
  "😽": "cat kiss",
  "🙀": "cat scream shocked",
  "😿": "cat crying sad",
  "😾": "cat pouting mad",
  "👋": "wave hello goodbye hand",
  "🤚": "raised back hand stop",
  "🖐️": "hand five spread fingers",
  "✋": "raised hand stop high five",
  "🖖": "vulcan salute live long prosper",
  "👌": "ok okay perfect fine",
  "🤌": "pinched fingers italian gesture",
  "🤏": "pinching small little",
  "✌️": "victory peace two fingers",
  "🤞": "crossed fingers luck hope",
  "🤟": "love you sign hand gesture",
  "🤘": "sign of horns rock metal",
  "🤙": "call me hand shaka",
  "👈": "pointing left direction",
  "👉": "pointing right direction",
  "👆": "pointing up direction above",
  "🖕": "middle finger rude offensive",
  "👇": "pointing down direction below",
  "☝️": "pointing up index finger one",
  "👍": "thumbs up good like yes approve",
  "👎": "thumbs down bad dislike no",
  "✊": "raised fist punch power",
  "👊": "oncoming fist punch hit",
  "🤛": "left facing fist bump",
  "🤜": "right facing fist bump",
  "👏": "clapping applause congratulations bravo",
  "🙌": "raising hands celebrate victory hooray",
  "🫶": "heart hands love care",
  "👐": "open hands hug receive",
  "🤲": "palms together prayer please",
  "🙏": "folded hands pray thank please namaste",
  "✍️": "writing signing pen hand",
  "💅": "nail polish manicure beauty fancy",
  "🤳": "selfie phone photo",
  "💪": "muscle flex strong arm bicep",
  "👀": "eyes look watching see",
  "👅": "tongue mouth taste",
  "👄": "mouth lips kiss speak",
  "🫦": "lips mouth bite kiss",
  "👶": "baby infant newborn child",
  "🧒": "child kid young",
  "👦": "boy young male child",
  "👧": "girl young female child",
  "🧑": "person adult neutral",
  "👱": "blond person hair",
  "👨": "man adult male person",
  "🧔": "beard man person",
  "👩": "woman adult female person",
  "🧓": "older person elderly",
  "👴": "old man elderly grandfather",
  "👵": "old woman elderly grandmother",
  "💃": "woman dancing dance party",
  "🕺": "man dancing disco party dance",
  "👫": "couple man woman together",
  "👬": "two men couple holding hands",
  "👭": "two women couple holding hands",
  "💏": "kiss couple romance love",
  "💑": "couple heart love romance",
  "👨‍👩‍👦": "family parents child together",
  "🗣️": "speaking mouth talking loud",
  "👤": "silhouette person shadow",
  "👥": "silhouettes people group",
  // Animals & Nature
  "🐶": "dog puppy pet animal cute",
  "🐱": "cat kitten pet animal cute",
  "🐭": "mouse rodent small animal",
  "🐹": "hamster cute pet rodent",
  "🐰": "rabbit bunny cute animal",
  "🦊": "fox sly cunning animal",
  "🐻": "bear animal teddy",
  "🐼": "panda bear black white china",
  "🐨": "koala australia bear cute",
  "🐯": "tiger wild big cat stripes",
  "🦁": "lion king pride jungle",
  "🐮": "cow milk farm animal moo",
  "🐷": "pig pork farm animal oink",
  "🐸": "frog green pond croak",
  "🐵": "monkey ape primate",
  "🙈": "see no evil monkey eyes",
  "🙉": "hear no evil monkey ears",
  "🙊": "speak no evil monkey mouth",
  "🐒": "monkey ape primate animal",
  "🐔": "chicken bird farm poultry",
  "🐧": "penguin bird cold arctic",
  "🐦": "bird tweet fly",
  "🐤": "chick baby bird yellow",
  "🦆": "duck quack bird water",
  "🦅": "eagle bird freedom strength",
  "🦉": "owl wise bird night",
  "🦇": "bat night halloween flying",
  "🐺": "wolf howl wild animal",
  "🐴": "horse equine fast animal",
  "🦄": "unicorn magic fantasy rainbow",
  "🐝": "bee honey insect yellow",
  "🦋": "butterfly colorful beautiful insect",
  "🐛": "caterpillar worm green bug",
  "🐌": "snail slow shell garden",
  "🐞": "ladybug red spots insect",
  "🐜": "ant small insect colony",
  "🦟": "mosquito bug bite insect",
  "🕷️": "spider web scary halloween",
  "🦂": "scorpion sting danger",
  "🐢": "turtle slow reptile shell",
  "🐍": "snake slither reptile",
  "🦎": "lizard reptile gecko",
  "🦖": "t-rex dinosaur prehistoric",
  "🦕": "sauropod dinosaur long neck",
  "🐙": "octopus sea tentacles",
  "🦑": "squid sea ocean",
  "🦐": "shrimp seafood small",
  "🦞": "lobster seafood red",
  "🦀": "crab seafood sideways",
  "🐡": "blowfish puffer fish sea",
  "🐠": "tropical fish colorful sea",
  "🐟": "fish sea water blue",
  "🐬": "dolphin smart ocean swim",
  "🐳": "whale ocean big water",
  "🐋": "whale ocean blue big",
  "🦈": "shark ocean danger fish",
  "🐊": "crocodile alligator reptile",
  "🐅": "tiger stripes wild cat",
  "🐆": "leopard spots cheetah cat",
  "🦓": "zebra stripes africa",
  "🦍": "gorilla ape primate strong",
  "🐘": "elephant big africa memory",
  "🦛": "hippo heavy large animal",
  "🦏": "rhinoceros rhino horn",
  "🐪": "camel hump desert",
  "🐫": "two hump camel bactrian",
  "🦒": "giraffe tall neck africa",
  "🦘": "kangaroo australia hop",
  "🦬": "bison buffalo america",
  "🐃": "water buffalo large animal",
  "🐄": "cow farm dairy",
  "🐎": "horse fast racing",
  "🐖": "pig pork farm",
  "🐏": "ram sheep male",
  "🐑": "sheep wool fluffy",
  "🦙": "llama alpaca wool",
  "🐐": "goat mountain horns",
  "🦌": "deer antlers forest",
  "🐕": "dog pet loyal",
  "🐩": "poodle dog fancy pet",
  "🐈": "cat feline pet",
  "🐓": "rooster cock farm bird",
  "🦃": "turkey thanksgiving bird",
  "🦚": "peacock colorful feathers",
  "🦜": "parrot colorful bird talk",
  "🦢": "swan white elegant bird",
  "🦩": "flamingo pink bird",
  "🕊️": "dove peace bird white",
  "🐇": "rabbit bunny white pet",
  "🦝": "raccoon trash mask",
  "🦨": "skunk smell stripe animal",
  "🦡": "badger stripe animal",
  "🦫": "beaver dam tail animal",
  "🦦": "otter cute swim animal",
  "🦥": "sloth slow animal",
  "🐁": "mouse small rodent",
  "🐀": "rat rodent animal",
  "🐿️": "chipmunk squirrel nuts",
  "🦔": "hedgehog spiny cute",
  "🌵": "cactus desert prickly",
  "🎄": "christmas tree holiday pine",
  "🌲": "tree pine evergreen nature",
  "🌳": "tree deciduous nature",
  "🌴": "palm tree tropical beach",
  "🪵": "log wood timber",
  "🌱": "seedling plant growing sprout",
  "🌿": "herb leaf plant green",
  "☘️": "shamrock clover lucky ireland",
  "🍀": "four leaf clover lucky",
  "🎋": "bamboo japanese lucky",
  "🎍": "pine decoration japanese",
  "🍃": "leaf wind fluttering green",
  "🍂": "fallen leaf autumn fall",
  "🍁": "maple leaf autumn canada",
  "🍄": "mushroom fungus toadstool",
  "🐚": "spiral shell ocean beach",
  "🌾": "wheat rice grain stalk",
  "💐": "bouquet flowers gift pretty",
  "🌷": "tulip flower spring pink",
  "🌹": "rose flower love red romance",
  "🥀": "wilted rose dead sad flower",
  "🌺": "hibiscus flower tropical",
  "🌸": "cherry blossom flower pink japan",
  "🌼": "blossom flower yellow daisy",
  "🌻": "sunflower yellow bright summer",
  "🌞": "sun smiling bright happy warm",
  "🌝": "full moon face bright",
  "🌛": "crescent moon first quarter",
  "🌜": "crescent moon last quarter",
  "🌚": "new moon face dark night",
  "🌕": "full moon bright night",
  "🌙": "crescent moon night sleep",
  "🌟": "glowing star bright sparkle",
  "⭐": "star favorite yellow",
  "🌠": "shooting star night wish",
  "☀️": "sun bright warm day",
  "🌤️": "sun behind small cloud",
  "⛅": "sun behind cloud partly cloudy",
  "🌥️": "sun behind large cloud",
  "☁️": "cloud overcast weather",
  "🌦️": "sun behind rain cloud",
  "🌧️": "rain cloud weather storm",
  "⛈️": "thunder storm lightning rain",
  "🌩️": "lightning bolt storm",
  "🌨️": "snow cold winter",
  "❄️": "snowflake cold winter ice",
  "☃️": "snowman winter cold big",
  "⛄": "snowman winter cold",
  "🌬️": "wind blowing air",
  "💨": "wind air dash fast",
  "💧": "droplet water blue rain",
  "💦": "water splashing wet",
  "🌊": "wave ocean sea water",
  "🌈": "rainbow colors colorful",
  "🌀": "cyclone spiral tornado",
  "🌁": "foggy bridge city",
  "🌫️": "fog mist cloud haze",
  // Food & Drink
  "🍎": "apple red fruit healthy",
  "🍐": "pear green fruit sweet",
  "🍊": "tangerine orange citrus fruit",
  "🍋": "lemon sour citrus yellow",
  "🍌": "banana yellow tropical fruit",
  "🍉": "watermelon summer red fruit",
  "🍇": "grapes purple fruit wine",
  "🍓": "strawberry red fruit sweet",
  "🫐": "blueberry blue fruit",
  "🍈": "melon green fruit",
  "🍒": "cherries red fruit sweet",
  "🍑": "peach fuzzy soft fruit",
  "🥭": "mango tropical yellow sweet",
  "🍍": "pineapple tropical spiky fruit",
  "🥥": "coconut tropical white milk",
  "🥝": "kiwi green fruit vitamin",
  "🍅": "tomato red vegetable salad",
  "🥑": "avocado green healthy toast",
  "🍆": "eggplant aubergine purple vegetable",
  "🥦": "broccoli green vegetable healthy",
  "🥬": "leafy green lettuce vegetable",
  "🥒": "cucumber green vegetable",
  "🌶️": "hot pepper spicy red chili",
  "🧄": "garlic flavor cooking herb",
  "🧅": "onion cooking flavor vegetable",
  "🥔": "potato starchy vegetable",
  "🍠": "roasted sweet potato",
  "🥐": "croissant pastry french breakfast",
  "🥯": "bagel bread round",
  "🍞": "bread loaf carb baked",
  "🥖": "baguette french bread",
  "🥨": "pretzel bread salty",
  "🧀": "cheese yellow dairy",
  "🥚": "egg oval white yolk",
  "🍳": "cooking frying pan egg breakfast",
  "🧈": "butter dairy spread",
  "🥞": "pancakes stack breakfast sweet",
  "🧇": "waffle breakfast sweet",
  "🥓": "bacon pork breakfast meat",
  "🥩": "steak meat red beef",
  "🍗": "poultry leg chicken fried",
  "🍖": "meat bone drumstick",
  "🌭": "hot dog frank sausage",
  "🍔": "hamburger burger fast food",
  "🍟": "fries french fries fast food",
  "🍕": "pizza slice italian food",
  "🫓": "flatbread pita bread",
  "🥪": "sandwich lunch food",
  "🥙": "stuffed flatbread gyro wrap",
  "🧆": "falafel middle eastern food",
  "🌮": "taco mexican food",
  "🌯": "burrito wrap mexican food",
  "🫔": "tamale mexican food",
  "🥗": "salad green healthy vegetable",
  "🥘": "shallow pan cooking",
  "🫕": "fondue pot food",
  "🍝": "spaghetti pasta italian noodles",
  "🍜": "noodle soup ramen asian",
  "🍲": "pot stew cooking warm",
  "🍛": "curry rice indian food",
  "🍣": "sushi japanese rice fish",
  "🍱": "bento box japanese lunch",
  "🥟": "dumpling gyoza pot sticker",
  "🦪": "oyster shellfish seafood",
  "🍤": "shrimp fried prawn seafood",
  "🍙": "rice ball japanese onigiri",
  "🍚": "cooked rice bowl asian",
  "🍘": "rice cracker japanese",
  "🍥": "fish cake swirl japanese",
  "🥮": "moon cake chinese",
  "🍢": "oden stick japanese",
  "🧁": "cupcake cake sweet dessert",
  "🍰": "cake slice sweet dessert birthday",
  "🎂": "birthday cake celebrate candles",
  "🍮": "custard pudding dessert sweet",
  "🍭": "lollipop candy sweet sugar",
  "🍬": "candy sweet sugar treat",
  "🍫": "chocolate bar sweet cocoa",
  "🍿": "popcorn cinema movies snack",
  "🍩": "doughnut sweet fried dessert donut",
  "🍪": "cookie sweet baked chocolate chip",
  "🌰": "chestnut nut brown",
  "🥜": "peanut nut legume",
  "🍯": "honey jar sweet syrup",
  "🧃": "juice box drink straw",
  "🥤": "cup straw soda drink",
  "🧋": "bubble tea boba drink milk tea",
  "☕": "coffee hot drink morning",
  "🫖": "teapot tea hot drink",
  "🍵": "teacup green tea hot drink",
  "🧉": "mate drink tea gourd",
  "🍺": "beer mug draft drink alcohol",
  "🍻": "beers cheers drink celebration",
  "🥂": "champagne glasses celebration toast",
  "🍷": "wine red glass drink alcohol",
  "🥃": "whiskey tumbler glass drink",
  "🍸": "cocktail martini drink glass",
  "🍹": "tropical drink cocktail fruity",
  "🧊": "ice cube cold frozen",
  "🥄": "spoon utensil eat",
  "🍴": "fork knife silverware utensil",
  "🍽️": "plate fork knife dinner",
  "🥢": "chopsticks asian utensil",
  "🧂": "salt shaker seasoning",
  "🫙": "jar container preserve",
  // Activities
  "⚽": "soccer football sport ball",
  "🏀": "basketball sport ball game",
  "🏈": "american football nfl sport",
  "⚾": "baseball sport ball game",
  "🥎": "softball sport ball",
  "🎾": "tennis sport ball racket",
  "🏐": "volleyball sport ball",
  "🏉": "rugby sport ball",
  "🥏": "flying disc frisbee sport",
  "🎱": "billiards pool eight ball game",
  "🪀": "yo-yo toy game",
  "🏓": "ping pong table tennis sport",
  "🏸": "badminton sport shuttlecock",
  "🏒": "ice hockey sport stick",
  "🏑": "field hockey sport stick",
  "🥍": "lacrosse sport stick",
  "🏏": "cricket sport bat",
  "🪃": "boomerang throw return",
  "🥅": "goal net sport",
  "⛳": "golf sport green hole",
  "🪁": "bow arrow archery",
  "🎣": "fishing rod hobby fish",
  "🤿": "diving scuba snorkel underwater",
  "🥊": "boxing gloves sport fight",
  "🥋": "martial arts karate taekwondo",
  "🎽": "running shirt sport",
  "🛹": "skateboard skate sport",
  "🛼": "roller skate skating",
  "🛷": "sled sledding winter",
  "⛸️": "ice skate figure skating winter",
  "🥌": "curling stone winter sport",
  "🎿": "ski skiing winter snow",
  "⛷️": "skier skiing winter sport",
  "🏂": "snowboard winter sport",
  "🪂": "parachute skydiving jump",
  "🏋️": "weightlifting gym sport strong",
  "🤼": "wrestling grapple sport",
  "🤸": "gymnastics cartwheel acrobat",
  "⛹️": "basketball player dribble",
  "🤺": "fencing sword sport",
  "🤾": "handball throwing sport",
  "🏌️": "golf player swing",
  "🏇": "horse racing jockey",
  "🧘": "yoga meditation calm lotus",
  "🏄": "surfing wave beach sport",
  "🏊": "swimming pool water sport",
  "🤽": "water polo sport",
  "🚣": "rowing boat water",
  "🧗": "climbing rock sport",
  "🚵": "mountain biking cycling sport",
  "🚴": "cycling riding bike sport",
  "🏆": "trophy win champion first prize",
  "🥇": "gold medal first place winner",
  "🥈": "silver medal second place",
  "🥉": "bronze medal third place",
  "🏅": "medal sport achievement",
  "🎖️": "medal decoration military",
  "🏵️": "rosette badge award",
  "🎗️": "ribbon awareness cause",
  "🎫": "ticket event admission",
  "🎟️": "admission ticket show",
  "🎪": "circus tent festival fair",
  "🤹": "juggling circus performance",
  "🎭": "theater performance art drama",
  "🩰": "ballet shoes dance",
  "🎨": "art paint palette creative",
  "🎬": "movie film cinema clapperboard",
  "🎤": "microphone sing karaoke music",
  "🎧": "headphones music listen audio",
  "🎼": "music score notes sheet",
  "🎹": "piano keyboard music instrument",
  "🥁": "drum music beat percussion",
  "🪘": "long drum music",
  "🎷": "saxophone jazz music instrument",
  "🎺": "trumpet brass music instrument",
  "🎸": "guitar music rock instrument",
  "🪕": "banjo country music instrument",
  "🎻": "violin string music instrument",
  "🎲": "die dice game chance random",
  "♟️": "chess game strategy",
  "🎯": "bullseye target dart goal",
  "🎳": "bowling ball pins sport",
  "🎮": "game controller video games",
  "🎰": "slot machine casino gambling",
  "🧩": "puzzle piece jigsaw game",
  "🪅": "pinata party fiesta",
  "🪆": "nesting doll russian matryoshka",
  "🪄": "magic wand spell trick",
  // Travel & Places
  "🚗": "car automobile drive vehicle red",
  "🚕": "taxi yellow cab car",
  "🚙": "suv car drive vehicle",
  "🚌": "bus public transport vehicle",
  "🚎": "trolleybus electric public transport",
  "🏎️": "racing car fast sport",
  "🚓": "police car cop emergency",
  "🚑": "ambulance emergency medical hospital",
  "🚒": "fire truck emergency fireman",
  "🚐": "minibus van transport",
  "🛻": "pickup truck vehicle",
  "🚚": "delivery truck transport",
  "🚛": "semi truck cargo",
  "🚜": "tractor farm vehicle",
  "🏍️": "motorcycle motorbike fast",
  "🛵": "motor scooter vespa",
  "🚲": "bicycle bike cycling ride",
  "🛴": "kick scooter ride",
  "🚏": "bus stop transport",
  "⛽": "fuel gas station pump",
  "🚨": "police light siren emergency",
  "🚥": "horizontal traffic light",
  "🚦": "vertical traffic light",
  "🛑": "stop sign red",
  "🚧": "construction warning barrier",
  "⚓": "anchor ship boat sea",
  "🛟": "ring buoy life safety",
  "⛵": "sailboat wind water",
  "🚤": "speedboat fast water",
  "🛥️": "motor boat water",
  "🛳️": "passenger ship cruise",
  "⛴️": "ferry boat transport",
  "🚢": "ship cruise ocean boat",
  "✈️": "airplane flight travel plane",
  "🛩️": "small plane aviation flying",
  "🛫": "airplane takeoff departure",
  "🛬": "airplane landing arrival",
  "💺": "seat chair airplane",
  "🚁": "helicopter fly air",
  "🚀": "rocket space launch",
  "🛸": "ufo flying saucer alien",
  "🎆": "fireworks celebration new year",
  "🎇": "sparkler firework celebration",
  "🗺️": "map world travel navigate",
  "🧭": "compass navigate direction",
  "🏔️": "mountain peak snow tall",
  "⛰️": "mountain nature landscape",
  "🌋": "volcano eruption fire",
  "🗻": "mount fuji japan mountain",
  "🏕️": "camping tent nature outdoor",
  "🏖️": "beach sand sea summer vacation",
  "🏜️": "desert sand hot dry",
  "🏝️": "island tropical ocean paradise",
  "🏟️": "stadium arena sport",
  "🏛️": "classical building pillars ancient",
  "🏗️": "construction building crane",
  "🏘️": "houses neighborhood",
  "🏚️": "derelict house abandoned",
  "🏠": "house home building",
  "🏡": "house garden home",
  "🏢": "office building corporate",
  "🏣": "post office japanese",
  "🏤": "european post office",
  "🏥": "hospital medical building health",
  "🏦": "bank building money",
  "🏨": "hotel building travel stay",
  "🏪": "convenience store shop",
  "🏫": "school building education",
  "🏬": "department store shopping",
  "🏭": "factory industrial building",
  "🏯": "japanese castle medieval",
  "🏰": "castle european fairy tale",
  "💒": "wedding chapel marry",
  "🗼": "eiffel tower paris france",
  "🗽": "statue of liberty usa new york",
  "⛪": "church religious building",
  "🕌": "mosque islam religion",
  "🛕": "hindu temple religion",
  "⛩️": "shrine japanese torii gate",
  "🕋": "kaaba mecca islam",
  "⛲": "fountain water park",
  "⛺": "tent camping outdoor",
  "🌁": "foggy city bridge",
  "🌃": "night stars city",
  "🏙️": "cityscape skyline buildings",
  "🌄": "sunrise mountain nature",
  "🌅": "sunrise sunset ocean horizon",
  "🌆": "city sunset buildings",
  "🌇": "city sunrise morning",
  "🌉": "bridge night city",
  "🎠": "carousel horse amusement",
  "🎡": "ferris wheel fair amusement",
  "🎢": "roller coaster thrill amusement",
  "🗿": "moai statue easter island",
  "🌐": "globe world earth internet",
  // Objects
  "💡": "light bulb idea bright",
  "🔦": "flashlight torch light dark",
  "🕯️": "candle flame light",
  "🪔": "diya oil lamp light",
  "💰": "money bag rich wealthy",
  "💴": "yen money japan",
  "💵": "dollar bill money cash",
  "💶": "euro money europe",
  "💷": "pound money uk",
  "💸": "flying money spend",
  "💳": "credit card payment swipe",
  "🪙": "coin money gold",
  "💹": "chart increasing yen money",
  "📈": "chart increasing growth trend",
  "📉": "chart decreasing loss drop",
  "📊": "bar chart graph statistics",
  "💼": "briefcase work business",
  "🛍️": "shopping bags retail",
  "🎒": "backpack school bag",
  "🧳": "luggage travel suitcase",
  "🌂": "umbrella rain closed",
  "☂️": "umbrella rain open",
  "🧵": "thread sewing needle",
  "🪡": "sewing needle thread",
  "🧶": "yarn knitting wool",
  "🥽": "goggles safety glasses",
  "🥼": "lab coat science doctor",
  "👔": "necktie shirt business formal",
  "👕": "tshirt shirt casual",
  "👖": "jeans denim pants",
  "🧣": "scarf winter warm",
  "🧤": "gloves winter hands",
  "🧥": "coat jacket winter",
  "🧦": "socks feet",
  "👗": "dress women clothes",
  "👘": "kimono japanese traditional",
  "🥻": "sari indian dress",
  "👙": "bikini swimwear beach",
  "👛": "purse small bag",
  "👜": "handbag women bag",
  "👝": "clutch bag pouch",
  "🎩": "top hat formal fancy",
  "🧢": "baseball cap hat",
  "💄": "lipstick beauty cosmetics red",
  "💍": "ring wedding engagement diamond",
  "💎": "gem diamond jewel sparkle",
  "🔔": "bell notification ring",
  "🔕": "bell slash muted silent",
  "🎵": "musical note song melody",
  "🎶": "musical notes music melody",
  "📣": "megaphone announce loud",
  "📢": "loudspeaker announce public",
  "📱": "phone smartphone mobile device",
  "☎️": "telephone landline call",
  "📞": "telephone receiver call",
  "📟": "pager beeper old",
  "📠": "fax machine old",
  "🔋": "battery charge power",
  "🔌": "electric plug power charge",
  "💻": "laptop computer work technology",
  "🖥️": "desktop computer monitor screen",
  "🖨️": "printer print paper",
  "⌨️": "keyboard typing computer",
  "🖱️": "mouse click computer",
  "💾": "floppy disk save old",
  "💿": "disk cd music computer",
  "📀": "dvd disk movie",
  "🎥": "movie camera film record",
  "📷": "camera photo picture",
  "📸": "camera flash photo selfie",
  "📹": "video camera film record",
  "📼": "videocassette vhs old record",
  "🔍": "magnifying glass search look",
  "🔎": "magnifying glass right search",
  "💊": "pill medicine health drug",
  "💉": "syringe injection vaccine",
  "🩸": "blood drop medical health",
  "🧬": "dna science genetics",
  "🦠": "microbe bacteria virus",
  "🧪": "test tube lab science",
  "🌡️": "thermometer temperature fever",
  "🧲": "magnet attract pull force",
  "🪜": "ladder climb step",
  "🧰": "toolbox fix tools repair",
  "🔧": "wrench repair fix tool",
  "🪛": "screwdriver fix tool",
  "🔩": "bolt nut screw metal",
  "⚙️": "gear settings cog mechanical",
  "🔗": "link chain connect url",
  "🔑": "key lock open",
  "🗝️": "old key vintage lock",
  "🔐": "locked key secure",
  "🔒": "locked closed secure private",
  "🛡️": "shield protect defense",
  "⚔️": "swords fight crossed battle",
  "🔨": "hammer build hit tool",
  "🪚": "saw cut wood tool",
  "🪓": "axe chop wood",
  "⛏️": "pick axe mine dig",
  "🧱": "brick wall building",
  "🪞": "mirror reflection look",
  "🪟": "window glass view",
  "🪑": "chair sit furniture",
  "🛋️": "couch sofa furniture sit",
  "🚪": "door open close enter",
  "🧹": "broom sweep clean",
  "🧺": "basket laundry clean",
  "🧻": "toilet paper roll bathroom",
  "🪣": "bucket pail water",
  "🧼": "soap clean wash",
  "🫧": "bubbles soap clean",
  "🧴": "lotion bottle cream",
  "🧷": "safety pin sewing",
  "🧽": "sponge clean wash",
  "🛒": "shopping cart basket",
  "🚽": "toilet bathroom",
  "🚿": "shower clean bathroom",
  "🛁": "bathtub bath relax",
  "🪠": "plunger bathroom unclog",
  "🔭": "telescope space stars",
  "🔬": "microscope science lab",
  "📡": "satellite dish signal",
  "📺": "television tv watch",
  "📻": "radio music listen",
  "🎙️": "studio microphone record podcast",
  "🕰️": "clock mantel time antique",
  "⏱️": "stopwatch timer sport",
  "⏲️": "timer countdown",
  "⏰": "alarm clock wake morning",
  "🗓️": "calendar date schedule",
  "📅": "calendar date event",
  "📆": "tear off calendar date",
  "🗒️": "spiral notepad notes",
  "📋": "clipboard notes document",
  "📁": "folder files organize",
  "📂": "open folder files",
  "📌": "pushpin location mark red",
  "📍": "pin location map marker",
  "✂️": "scissors cut craft",
  "🗃️": "card file box organize",
  "🗂️": "card index dividers",
  "📦": "package box delivery",
  "📫": "mailbox letter mail closed",
  "📬": "mailbox letter mail open",
  "📭": "mailbox empty open",
  "📮": "postbox red mail",
  "🖊️": "pen write ink",
  "📝": "memo write notes",
  "✏️": "pencil write edit",
  "📏": "ruler measure straight",
  "📐": "triangular ruler measure geometry",
  "🔖": "bookmark save tab",
  // Symbols
  "❤️": "red heart love romance",
  "🧡": "orange heart love",
  "💛": "yellow heart love friendship",
  "💚": "green heart love nature",
  "💙": "blue heart love trust",
  "💜": "purple heart love royalty",
  "🖤": "black heart dark love",
  "🤍": "white heart pure clean",
  "🤎": "brown heart warm earth",
  "💔": "broken heart sad loss heartbreak",
  "❣️": "heart exclamation love punctuation",
  "💕": "two hearts love couple",
  "💞": "revolving hearts love floating",
  "💓": "beating heart love pulse",
  "💗": "growing heart love",
  "💖": "sparkling heart love glitter",
  "💘": "heart arrow cupid love",
  "💝": "heart ribbon love gift",
  "💟": "heart decoration",
  "☮️": "peace sign symbol",
  "✝️": "cross christian religion",
  "☪️": "star crescent islam religion",
  "🕉️": "om hindu religion",
  "☸️": "dharma wheel buddhism",
  "✡️": "star of david jewish religion",
  "🔯": "dotted six pointed star",
  "☯️": "yin yang balance peace",
  "☦️": "orthodox cross religion",
  "🛐": "place of worship religion",
  "☢️": "radioactive nuclear warning",
  "☣️": "biohazard danger warning",
  "✴️": "eight pointed star sparkle",
  "🆚": "vs versus battle",
  "💯": "hundred percent perfect score",
  "💢": "anger symbol mad",
  "♨️": "hot springs steam",
  "🔞": "no one under eighteen adult",
  "📵": "no mobile phone off",
  "🚭": "no smoking prohibited",
  "❌": "cross x no wrong cancel",
  "⭕": "circle hollow empty",
  "🛑": "stop sign octagon",
  "⛔": "no entry prohibited stop",
  "📛": "name badge id",
  "🚫": "prohibited banned no",
  "❗": "exclamation mark important",
  "❕": "white exclamation",
  "❓": "question mark help unknown",
  "❔": "white question mark",
  "‼️": "double exclamation marks",
  "⁉️": "exclamation question mark",
  "⚠️": "warning caution danger",
  "🚸": "children crossing warning",
  "🔱": "trident emblem symbol",
  "⚜️": "fleur de lis symbol",
  "🔰": "japanese symbol beginner",
  "♻️": "recycle green environment",
  "✅": "check mark done complete yes",
  "❎": "cross mark button x",
  "🌐": "globe world earth internet",
  "💠": "diamond blue geometric",
  "🌀": "cyclone spiral dizzy",
  "💤": "zzz sleep tired snore",
  "🏧": "atm cash machine",
  "🚾": "water closet bathroom wc",
  "♿": "wheelchair disabled accessibility",
  "🅿️": "parking sign",
  "🚹": "men restroom",
  "🚺": "women restroom",
  "🚼": "baby stroller",
  "⚧️": "transgender symbol",
  "🚮": "litter bin trash",
  "📶": "signal bars wifi cellular",
  ℹ️: "information help",
  "🔤": "abc letters input",
  "🔡": "abc lowercase letters",
  "🔢": "numbers input one two three",
  "🆖": "ng not good button",
  "🆗": "ok button square",
  "🆙": "up button",
  "🆒": "cool button",
  "🆕": "new button fresh",
  "🆓": "free button",
  "🔔": "bell notification ring",
  "🔕": "bell slash muted silent",
  "🎵": "musical note song",
  "🎶": "musical notes music",
  "💤": "zzz sleep tired",
  "🔅": "dim brightness low",
  "🔆": "bright brightness high",
  "🔀": "shuffle random music",
  "🔁": "repeat loop music",
  "🔂": "repeat single music",
  "🔃": "clockwise arrows",
  "▶️": "play button start",
  "⏩": "fast forward skip",
  "⏭️": "skip forward next",
  "⏯️": "play pause toggle",
  "◀️": "play reverse back",
  "⏪": "fast reverse rewind",
  "⏮️": "skip back previous",
  "🔼": "up button arrow",
  "🔽": "down button arrow",
  "⏸️": "pause button stop",
  "⏹️": "stop button square",
  "⏺️": "record button",
  "🔀": "shuffle random",
  "📳": "vibration mode phone",
  "📴": "mobile phone off",
  "📲": "mobile phone arrow incoming",
};

function App() {
  // 1. AUTHENTICATION & PORTAL STATES
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(""); // This state will be used to store the OTP entered by the user in the input field. It will be updated as the user types and can be used for verification when the user submits the OTP.
  const [generatedOTP, setGeneratedOTP] = useState(""); // Needed for verification simulation
  const [showSimulation, setShowSimulation] = useState(false); // Needed for modal
  const [isExpired, setIsExpired] = useState(false); // For OTP countdown

  // 2. CHAT & CONTACT STATES
  const [contacts, setContacts] = useState([
    { id: "tech-lead", name: "Tech Lead", status: "online", color: "bg-blue-500", avatar: null },
    { id: "project-manager", name: "Project Manager", status: "last seen 2:00 PM", color: "bg-purple-500", avatar: null },
    { id: "dev-team", name: "Dev Team Group", status: "Group Chat", color: "bg-orange-500", avatar: null },
  ]);
  const [activeContactId, setActiveContactId] = useState("tech-lead");
  const [archivedContactIds, setArchivedContactIds] = useState(new Set());
  const [showArchivedSection, setShowArchivedSection] = useState(false);
  const [contactMenuId, setContactMenuId] = useState(null); // ID of contact whose context menu is open
  const [showAddContactModal, setShowAddContactModal] = useState(false);
  const [newContactName, setNewContactName] = useState("");
  const [newContactPhone, setNewContactPhone] = useState("");
  const [newContactColor, setNewContactColor] = useState("bg-violet-500");
  const [messages, setMessages] = useState([
    { id: 1, text: "Hey, how is the ChatterBox progress?", sender: "them", time: "1:05 PM" },
    { id: 2, text: "The login portal is merged into main!", sender: "me", time: "1:08 PM", status: "read" /*Options: "sent", "delivered", "read" */ },
    { id: 3, text: "Hello chat", sender: "me", time: "3:29 PM", status: "delivered" },
  ]);
  const [newMessage, setNewMessage] = useState(""); // This will be used to store the text of the new message being typed in the input field.
  const [searchTerm, setSearchTerm] = useState(""); // This will be used to implement the search functionality in the sidebar.

  // 3. UI & THEME STATES
  const [theme, setTheme] = useState("light"); // Default to light
  // 3b. BLUETOOTH STATES
  const [showBluetoothModal, setShowBluetoothModal] = useState(false);
  const [isBluetoothScanning, setIsBluetoothScanning] = useState(false);
  const [discoveredBLEDevices, setDiscoveredBLEDevices] = useState([]); // [{deviceId, name, rssi}]
  const [isTyping, setIsTyping] = useState(false); // State to track if the user is currently typing a message. This can be used to show "typing..." indicators in the UI.
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [activeEmojiTab, setActiveEmojiTab] = useState(0);
  const [emojiSearch, setEmojiSearch] = useState("");
  const [wallpaper, setWallpaper] = useState("classic"); // State to manage the current wallpaper selection for the chat background. This allows users to switch between different wallpapers, enhancing personalization.

  // 4. VOICE & MEDIA STATES (Keep these for later)
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [playingAudioId, setPlayingAudioId] = useState(null); // Track which audio is playing
  const [visualizerData, setVisualizerData] = useState(new Array(10).fill(0));
  const [playbackSpeed, setPlaybackSpeed] = useState({}); // Playback speed per message: { messageId: 1 }
  const [voiceWaveforms, setVoiceWaveforms] = useState({}); // Store waveform data per message
  const [isSharingContact, setIsSharingContact] = useState(false);

  // 5. REFS
  // These refs are used to manage direct DOM access for certain elements, such as scrolling to the bottom of the chat when a new message is added, handling timers for voice recording, managing the media recorder instance, and tracking the emoji picker for click outside detection.
  const messagesEndRef = useRef(null);
  const timerRef = useRef(null);
  const mediaRecorder = useRef(null);
  const audioChunks = useRef([]);
  const audioPlayerRef = useRef(new Audio()); // Global audio player instance — NOT tied to a DOM element
  const analyzerRef = useRef(null);
  const analyzerRafRef = useRef(null); // Tracks the RAF ID for the recording visualizer so we can cancel it
  const streamRef = useRef(null); // Tracks the mic stream so we can release it after recording
  const emojiPickerRef = useRef(null); // To track the picker and a useEffect to listen for clicks on the rest of the document

  // --- EMOJI DATA ---
  // This is a structured array of emoji categories, where each category has a name, an icon representing it, and a list of emojis that belong to that category. This structure allows for easy rendering of the emoji picker with categorized tabs and efficient searching/filtering of emojis based on user input.
  const EMOJI_CATEGORIES = [
    {
      name: "Smileys & People",
      icon: "😀",
      emojis: [
        "😀",
        "😃",
        "😄",
        "😁",
        "😆",
        "😅",
        "😂",
        "🤣",
        "😊",
        "😇",
        "🙂",
        "🙃",
        "😉",
        "😌",
        "😍",
        "🥰",
        "😘",
        "😗",
        "😙",
        "😋",
        "😛",
        "😝",
        "😜",
        "🤪",
        "🤨",
        "🧐",
        "🤓",
        "😎",
        "🥸",
        "🤩",
        "🥳",
        "😏",
        "😒",
        "😞",
        "😔",
        "😟",
        "😕",
        "🙁",
        "☹️",
        "😣",
        "😖",
        "😫",
        "😩",
        "🥺",
        "😢",
        "😭",
        "😤",
        "😠",
        "😡",
        "🤬",
        "🤯",
        "😳",
        "🥵",
        "🥶",
        "😱",
        "😨",
        "😰",
        "😥",
        "😓",
        "🤗",
        "🤔",
        "🤭",
        "🤫",
        "🤥",
        "😶",
        "😐",
        "😑",
        "😬",
        "🙄",
        "😯",
        "😦",
        "😧",
        "😮",
        "😲",
        "🥱",
        "😴",
        "🤤",
        "😪",
        "😵",
        "🤐",
        "🥴",
        "🤢",
        "🤮",
        "🤧",
        "😷",
        "🤒",
        "🤕",
        "🤑",
        "🤠",
        "😈",
        "👿",
        "👹",
        "👺",
        "🤡",
        "💩",
        "👻",
        "💀",
        "👽",
        "👾",
        "🤖",
        "😺",
        "😸",
        "😹",
        "😻",
        "😼",
        "😽",
        "🙀",
        "😿",
        "😾",
        "👋",
        "🤚",
        "🖐️",
        "✋",
        "🖖",
        "👌",
        "🤌",
        "🤏",
        "✌️",
        "🤞",
        "🤟",
        "🤘",
        "🤙",
        "👈",
        "👉",
        "👆",
        "🖕",
        "👇",
        "☝️",
        "👍",
        "👎",
        "✊",
        "👊",
        "🤛",
        "🤜",
        "👏",
        "🙌",
        "🫶",
        "👐",
        "🤲",
        "🙏",
        "✍️",
        "💅",
        "🤳",
        "💪",
        "🦵",
        "🦶",
        "👀",
        "👅",
        "👄",
        "🫦",
        "👶",
        "🧒",
        "👦",
        "👧",
        "🧑",
        "👱",
        "👨",
        "🧔",
        "👩",
        "🧓",
        "👴",
        "👵",
        "🧏",
        "💃",
        "🕺",
        "👫",
        "👬",
        "👭",
        "💏",
        "💑",
        "👨‍👩‍👦",
        "🗣️",
        "👤",
        "👥",
      ],
    },
    {
      name: "Animals & Nature",
      icon: "🐶",
      emojis: [
        "🐶",
        "🐱",
        "🐭",
        "🐹",
        "🐰",
        "🦊",
        "🐻",
        "🐼",
        "🐨",
        "🐯",
        "🦁",
        "🐮",
        "🐷",
        "🐸",
        "🐵",
        "🙈",
        "🙉",
        "🙊",
        "🐒",
        "🐔",
        "🐧",
        "🐦",
        "🐤",
        "🦆",
        "🦅",
        "🦉",
        "🦇",
        "🐺",
        "🐗",
        "🐴",
        "🦄",
        "🐝",
        "🪱",
        "🐛",
        "🦋",
        "🐌",
        "🐞",
        "🐜",
        "🪲",
        "🦟",
        "🦗",
        "🕷️",
        "🦂",
        "🐢",
        "🐍",
        "🦎",
        "🦖",
        "🦕",
        "🐙",
        "🦑",
        "🦐",
        "🦞",
        "🦀",
        "🐡",
        "🐠",
        "🐟",
        "🐬",
        "🐳",
        "🐋",
        "🦈",
        "🐊",
        "🐅",
        "🐆",
        "🦓",
        "🦍",
        "🐘",
        "🦛",
        "🦏",
        "🐪",
        "🐫",
        "🦒",
        "🦘",
        "🦬",
        "🐃",
        "🐄",
        "🐎",
        "🐖",
        "🐏",
        "🐑",
        "🦙",
        "🐐",
        "🦌",
        "🐕",
        "🐩",
        "🐈",
        "🐓",
        "🦃",
        "🦤",
        "🦚",
        "🦜",
        "🦢",
        "🦩",
        "🕊️",
        "🐇",
        "🦝",
        "🦨",
        "🦡",
        "🦫",
        "🦦",
        "🦥",
        "🐁",
        "🐀",
        "🐿️",
        "🦔",
        "🌵",
        "🎄",
        "🌲",
        "🌳",
        "🌴",
        "🪵",
        "🌱",
        "🌿",
        "☘️",
        "🍀",
        "🎋",
        "🎍",
        "🍃",
        "🍂",
        "🍁",
        "🍄",
        "🐚",
        "🪸",
        "🌾",
        "💐",
        "🌷",
        "🌹",
        "🥀",
        "🌺",
        "🌸",
        "🌼",
        "🌻",
        "🌞",
        "🌝",
        "🌛",
        "🌜",
        "🌚",
        "🌕",
        "🌙",
        "🌟",
        "⭐",
        "🌠",
        "☀️",
        "🌤️",
        "⛅",
        "🌥️",
        "☁️",
        "🌦️",
        "🌧️",
        "⛈️",
        "🌩️",
        "🌨️",
        "❄️",
        "☃️",
        "⛄",
        "🌬️",
        "💨",
        "💧",
        "💦",
        "🌊",
        "🌈",
        "🌀",
        "🌁",
        "🌫️",
      ],
    },
    {
      name: "Food & Drink",
      icon: "🍎",
      emojis: [
        "🍎",
        "🍐",
        "🍊",
        "🍋",
        "🍌",
        "🍉",
        "🍇",
        "🍓",
        "🫐",
        "🍈",
        "🍒",
        "🍑",
        "🥭",
        "🍍",
        "🥥",
        "🥝",
        "🍅",
        "🥑",
        "🍆",
        "🥦",
        "🥬",
        "🥒",
        "🌶️",
        "🧄",
        "🧅",
        "🥔",
        "🍠",
        "🥐",
        "🥯",
        "🍞",
        "🥖",
        "🥨",
        "🧀",
        "🥚",
        "🍳",
        "🧈",
        "🥞",
        "🧇",
        "🥓",
        "🥩",
        "🍗",
        "🍖",
        "🌭",
        "🍔",
        "🍟",
        "🍕",
        "🫓",
        "🥪",
        "🥙",
        "🧆",
        "🌮",
        "🌯",
        "🫔",
        "🥗",
        "🥘",
        "🫕",
        "🍝",
        "🍜",
        "🍲",
        "🍛",
        "🍣",
        "🍱",
        "🥟",
        "🦪",
        "🍤",
        "🍙",
        "🍚",
        "🍘",
        "🍥",
        "🥮",
        "🍢",
        "🧁",
        "🍰",
        "🎂",
        "🍮",
        "🍭",
        "🍬",
        "🍫",
        "🍿",
        "🍩",
        "🍪",
        "🌰",
        "🥜",
        "🍯",
        "🧃",
        "🥤",
        "🧋",
        "☕",
        "🫖",
        "🍵",
        "🧉",
        "🍺",
        "🍻",
        "🥂",
        "🍷",
        "🥃",
        "🍸",
        "🍹",
        "🧊",
        "🥄",
        "🍴",
        "🍽️",
        "🥢",
        "🧂",
        "🫙",
      ],
    },
    {
      name: "Activities",
      icon: "⚽",
      emojis: [
        "⚽",
        "🏀",
        "🏈",
        "⚾",
        "🥎",
        "🎾",
        "🏐",
        "🏉",
        "🥏",
        "🎱",
        "🪀",
        "🏓",
        "🏸",
        "🏒",
        "🏑",
        "🥍",
        "🏏",
        "🪃",
        "🥅",
        "⛳",
        "🪁",
        "🎣",
        "🤿",
        "🥊",
        "🥋",
        "🎽",
        "🛹",
        "🛼",
        "🛷",
        "⛸️",
        "🥌",
        "🎿",
        "⛷️",
        "🏂",
        "🪂",
        "🏋️",
        "🤼",
        "🤸",
        "⛹️",
        "🤺",
        "🤾",
        "🏌️",
        "🏇",
        "🧘",
        "🏄",
        "🏊",
        "🤽",
        "🚣",
        "🧗",
        "🚵",
        "🚴",
        "🏆",
        "🥇",
        "🥈",
        "🥉",
        "🏅",
        "🎖️",
        "🏵️",
        "🎗️",
        "🎫",
        "🎟️",
        "🎪",
        "🤹",
        "🎭",
        "🩰",
        "🎨",
        "🎬",
        "🎤",
        "🎧",
        "🎼",
        "🎹",
        "🥁",
        "🪘",
        "🎷",
        "🎺",
        "🎸",
        "🪕",
        "🎻",
        "🎲",
        "♟️",
        "🎯",
        "🎳",
        "🎮",
        "🎰",
        "🧩",
        "🪅",
        "🪆",
        "🪄",
      ],
    },
    {
      name: "Travel & Places",
      icon: "✈️",
      emojis: [
        "🚗",
        "🚕",
        "🚙",
        "🚌",
        "🚎",
        "🏎️",
        "🚓",
        "🚑",
        "🚒",
        "🚐",
        "🛻",
        "🚚",
        "🚛",
        "🚜",
        "🏍️",
        "🛵",
        "🚲",
        "🛴",
        "🛹",
        "🚏",
        "⛽",
        "🚨",
        "🚥",
        "🚦",
        "🛑",
        "🚧",
        "⚓",
        "🛟",
        "⛵",
        "🚤",
        "🛥️",
        "🛳️",
        "⛴️",
        "🚢",
        "✈️",
        "🛩️",
        "🛫",
        "🛬",
        "💺",
        "🚁",
        "🚀",
        "🛸",
        "🎆",
        "🎇",
        "🗺️",
        "🧭",
        "🏔️",
        "⛰️",
        "🌋",
        "🗻",
        "🏕️",
        "🏖️",
        "🏜️",
        "🏝️",
        "🏟️",
        "🏛️",
        "🏗️",
        "🏘️",
        "🏚️",
        "🏠",
        "🏡",
        "🏢",
        "🏣",
        "🏤",
        "🏥",
        "🏦",
        "🏨",
        "🏪",
        "🏫",
        "🏬",
        "🏭",
        "🏯",
        "🏰",
        "💒",
        "🗼",
        "🗽",
        "⛪",
        "🕌",
        "🛕",
        "⛩️",
        "🕋",
        "⛲",
        "⛺",
        "🌁",
        "🌃",
        "🏙️",
        "🌄",
        "🌅",
        "🌆",
        "🌇",
        "🌉",
        "🎠",
        "🎡",
        "🎢",
        "🎪",
        "🗿",
        "🌐",
      ],
    },
    {
      name: "Objects",
      icon: "💡",
      emojis: [
        "💡",
        "🔦",
        "🕯️",
        "🪔",
        "💰",
        "💴",
        "💵",
        "💶",
        "💷",
        "💸",
        "💳",
        "🪙",
        "💹",
        "📈",
        "📉",
        "📊",
        "💼",
        "🛍️",
        "🎒",
        "🧳",
        "🌂",
        "☂️",
        "🧵",
        "🪡",
        "🧶",
        "🥽",
        "🥼",
        "👔",
        "👕",
        "👖",
        "🧣",
        "🧤",
        "🧥",
        "🧦",
        "👗",
        "👘",
        "🥻",
        "👙",
        "👛",
        "👜",
        "👝",
        "🎩",
        "🧢",
        "💄",
        "💍",
        "💎",
        "🔔",
        "🔕",
        "🎵",
        "🎶",
        "📣",
        "📢",
        "📱",
        "☎️",
        "📞",
        "📟",
        "📠",
        "🔋",
        "🔌",
        "💻",
        "🖥️",
        "🖨️",
        "⌨️",
        "🖱️",
        "💾",
        "💿",
        "📀",
        "🎥",
        "📷",
        "📸",
        "📹",
        "📼",
        "🔍",
        "🔎",
        "💊",
        "💉",
        "🩸",
        "🧬",
        "🦠",
        "🧪",
        "🌡️",
        "🧲",
        "🪜",
        "🧰",
        "🔧",
        "🪛",
        "🔩",
        "⚙️",
        "🔗",
        "🔑",
        "🗝️",
        "🔐",
        "🔒",
        "🛡️",
        "⚔️",
        "🔨",
        "🪚",
        "🪓",
        "⛏️",
        "🧱",
        "🪞",
        "🪟",
        "🪑",
        "🛋️",
        "🚪",
        "🧹",
        "🧺",
        "🧻",
        "🪣",
        "🧼",
        "🫧",
        "🧴",
        "🧷",
        "🧹",
        "🧽",
        "🛒",
        "🚽",
        "🚿",
        "🛁",
        "🪠",
        "🔭",
        "🔬",
        "📡",
        "📺",
        "📻",
        "🎙️",
        "📢",
        "🕰️",
        "⏱️",
        "⏲️",
        "⏰",
        "🗓️",
        "📅",
        "📆",
        "🗒️",
        "📋",
        "📁",
        "📂",
        "📌",
        "📍",
        "✂️",
        "🗃️",
        "🗂️",
        "📦",
        "📫",
        "📬",
        "📭",
        "📮",
        "🖊️",
        "📝",
        "✏️",
        "📏",
        "📐",
        "🔖",
      ],
    },
    {
      name: "Symbols",
      icon: "❤️",
      emojis: [
        "❤️",
        "🧡",
        "💛",
        "💚",
        "💙",
        "💜",
        "🖤",
        "🤍",
        "🤎",
        "💔",
        "❣️",
        "💕",
        "💞",
        "💓",
        "💗",
        "💖",
        "💘",
        "💝",
        "💟",
        "☮️",
        "✝️",
        "☪️",
        "🕉️",
        "☸️",
        "✡️",
        "🔯",
        "☯️",
        "☦️",
        "🛐",
        "⛎",
        "♈",
        "♉",
        "♊",
        "♋",
        "♌",
        "♍",
        "♎",
        "♏",
        "♐",
        "♑",
        "♒",
        "♓",
        "🆔",
        "⚛️",
        "☢️",
        "☣️",
        "✴️",
        "🆚",
        "💯",
        "💢",
        "♨️",
        "🔞",
        "📵",
        "🚭",
        "❌",
        "⭕",
        "🛑",
        "⛔",
        "📛",
        "🚫",
        "❗",
        "❕",
        "❓",
        "❔",
        "‼️",
        "⁉️",
        "⚠️",
        "🚸",
        "🔱",
        "⚜️",
        "🔰",
        "♻️",
        "✅",
        "❎",
        "🌐",
        "💠",
        "Ⓜ️",
        "🌀",
        "💤",
        "🏧",
        "🚾",
        "♿",
        "🅿️",
        "🚹",
        "🚺",
        "🚻",
        "🚼",
        "⚧️",
        "🚮",
        "🎦",
        "📶",
        "ℹ️",
        "🔤",
        "🔡",
        "🔢",
        "🆖",
        "🆗",
        "🆙",
        "🆒",
        "🆕",
        "🆓",
        "0️⃣",
        "1️⃣",
        "2️⃣",
        "3️⃣",
        "4️⃣",
        "5️⃣",
        "6️⃣",
        "7️⃣",
        "8️⃣",
        "9️⃣",
        "🔟",
        "▶️",
        "⏩",
        "⏭️",
        "⏯️",
        "◀️",
        "⏪",
        "⏮️",
        "🔼",
        "🔽",
        "⏸️",
        "⏹️",
        "⏺️",
        "🔀",
        "🔁",
        "🔂",
        "🔃",
        "🎦",
        "🔅",
        "🔆",
        "📶",
        "🔔",
        "🔕",
        "📳",
        "📴",
        "📵",
        "📲",
      ],
    },
    {
      name: "Flags",
      icon: "🏳️",
      emojis: [
        "🏳️",
        "🏴",
        "🏴‍☠️",
        "🏁",
        "🚩",
        "🏳️‍🌈",
        "🏳️‍⚧️",
        "🇺🇳",
        "🇦🇫",
        "🇦🇱",
        "🇩🇿",
        "🇦🇩",
        "🇦🇴",
        "🇦🇷",
        "🇦🇲",
        "🇦🇺",
        "🇦🇹",
        "🇦🇿",
        "🇧🇸",
        "🇧🇭",
        "🇧🇩",
        "🇧🇧",
        "🇧🇾",
        "🇧🇪",
        "🇧🇿",
        "🇧🇯",
        "🇧🇹",
        "🇧🇴",
        "🇧🇦",
        "🇧🇼",
        "🇧🇷",
        "🇧🇳",
        "🇧🇬",
        "🇧🇫",
        "🇧🇮",
        "🇨🇻",
        "🇰🇭",
        "🇨🇲",
        "🇨🇦",
        "🇨🇫",
        "🇹🇩",
        "🇨🇱",
        "🇨🇳",
        "🇨🇴",
        "🇰🇲",
        "🇨🇬",
        "🇨🇩",
        "🇨🇷",
        "🇨🇮",
        "🇭🇷",
        "🇨🇺",
        "🇨🇾",
        "🇨🇿",
        "🇩🇰",
        "🇩🇯",
        "🇩🇲",
        "🇩🇴",
        "🇪🇨",
        "🇪🇬",
        "🇸🇻",
        "🇬🇶",
        "🇪🇷",
        "🇪🇪",
        "🇸🇿",
        "🇪🇹",
        "🇫🇯",
        "🇫🇮",
        "🇫🇷",
        "🇬🇦",
        "🇬🇲",
        "🇬🇪",
        "🇩🇪",
        "🇬🇭",
        "🇬🇷",
        "🇬🇩",
        "🇬🇹",
        "🇬🇳",
        "🇬🇼",
        "🇬🇾",
        "🇭🇹",
        "🇭🇳",
        "🇭🇺",
        "🇮🇸",
        "🇮🇳",
        "🇮🇩",
        "🇮🇷",
        "🇮🇶",
        "🇮🇪",
        "🇮🇱",
        "🇮🇹",
        "🇯🇲",
        "🇯🇵",
        "🇯🇴",
        "🇰🇿",
        "🇰🇪",
        "🇰🇮",
        "🇽🇰",
        "🇰🇼",
        "🇰🇬",
        "🇱🇦",
        "🇱🇻",
        "🇱🇧",
        "🇱🇸",
        "🇱🇷",
        "🇱🇾",
        "🇱🇮",
        "🇱🇹",
        "🇱🇺",
        "🇲🇬",
        "🇲🇼",
        "🇲🇾",
        "🇲🇻",
        "🇲🇱",
        "🇲🇹",
        "🇲🇭",
        "🇲🇷",
        "🇲🇺",
        "🇲🇽",
        "🇫🇲",
        "🇲🇩",
        "🇲🇨",
        "🇲🇳",
        "🇲🇪",
        "🇲🇦",
        "🇲🇿",
        "🇲🇲",
        "🇳🇦",
        "🇳🇷",
        "🇳🇵",
        "🇳🇱",
        "🇳🇿",
        "🇳🇮",
        "🇳🇪",
        "🇳🇬",
        "🇲🇰",
        "🇳🇴",
        "🇴🇲",
        "🇵🇰",
        "🇵🇼",
        "🇵🇦",
        "🇵🇬",
        "🇵🇾",
        "🇵🇪",
        "🇵🇭",
        "🇵🇱",
        "🇵🇹",
        "🇶🇦",
        "🇷🇴",
        "🇷🇺",
        "🇷🇼",
        "🇰🇳",
        "🇱🇨",
        "🇻🇨",
        "🇼🇸",
        "🇸🇲",
        "🇸🇹",
        "🇸🇦",
        "🇸🇳",
        "🇷🇸",
        "🇸🇱",
        "🇸🇬",
        "🇸🇰",
        "🇸🇮",
        "🇸🇧",
        "🇸🇴",
        "🇿🇦",
        "🇸🇸",
        "🇪🇸",
        "🇱🇰",
        "🇸🇩",
        "🇸🇷",
        "🇸🇪",
        "🇨🇭",
        "🇸🇾",
        "🇹🇼",
        "🇹🇯",
        "🇹🇿",
        "🇹🇭",
        "🇹🇱",
        "🇹🇬",
        "🇹🇴",
        "🇹🇹",
        "🇹🇳",
        "🇹🇷",
        "🇹🇲",
        "🇺🇬",
        "🇺🇦",
        "🇦🇪",
        "🇬🇧",
        "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
        "🏴󠁧󠁢󠁳󠁣󠁴󠁿",
        "🏴󠁧󠁢󠁷󠁬󠁳󠁿",
        "🇺🇸",
        "🇺🇾",
        "🇺🇿",
        "🇻🇺",
        "🇻🇪",
        "🇻🇳",
        "🇾🇪",
        "🇿🇲",
        "🇿🇼",
      ],
    },
  ];

  // --- AUTHENTICATION LOGIC ---

  // This function simulates the process of requesting an OTP (One-Time Password) for authentication. It checks if the entered phone number is valid (length greater than 9), generates a random 6-digit OTP, and then opens a modal to show the generated OTP for simulation purposes.
  const handleRequestOtp = () => {
    if (phone && phone.length > 9) {
      // Create a random 6-digit code for the simulation
      const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOTP(newOtp);
      setShowSimulation(true); // This opens the "Secure Access" modal we built
    } else {
      alert("Please enter a valid phone number.");
    }
  };

  // This function checks if the entered OTP matches the generated OTP. If it does, it unlocks the app; if not, it shows an error message.
  const handleVerifyOtp = () => {
    // For development, let's use '123456' as our secret code
    if (otp === generatedOTP || otp === "123456") {
      setIsUnlocked(true);
      setIsVerifying(false);
    } else {
      alert("Invalid code. Check the simulation box!");
    }
  };

  // This function simulates sharing a contact in the chat. When you select a contact to share, it creates a new message of type "contact" with the contact's information and adds it to the messages state. It then closes the contact sharing UI.
  const handleShareContact = (contact) => {
    const contactMsg = {
      id: Date.now(),
      sender: "me",
      type: "contact", // This triggers your contact card UI
      text: contact.name,
      phone: contact.phone,
      avatar: contact.avatar,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      status: "sent",
      contactId: activeContactId,
    };
    setMessages([...messages, contactMsg]);
    setIsSharingContact(false);
  };

  const handleAvatarUpload = (contactId, file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      setContacts((prev) => prev.map((c) => (c.id === contactId ? { ...c, avatar: e.target.result } : c)));
    };
    reader.readAsDataURL(file);
  };

  // ─── Contact management ───────────────────────────────────────────────────
  const CONTACT_COLORS = ["bg-blue-500", "bg-violet-500", "bg-pink-500", "bg-emerald-500", "bg-orange-500", "bg-teal-500", "bg-rose-500", "bg-indigo-500"];

  const handleAddContact = () => {
    if (!newContactName.trim()) return;
    const id = `contact-${Date.now()}`;
    setContacts((prev) => [
      ...prev,
      { id, name: newContactName.trim(), status: newContactPhone.trim() || "Online • Secure", color: newContactColor, avatar: null },
    ]);
    setNewContactName("");
    setNewContactPhone("");
    setNewContactColor("bg-violet-500");
    setShowAddContactModal(false);
    setActiveContactId(id);
  };

  const handleDeleteContact = (contactId) => {
    setMessages((prev) => prev.filter((m) => m.contactId !== contactId));
    setContacts((prev) => {
      const next = prev.filter((c) => c.id !== contactId);
      if (activeContactId === contactId) {
        const nextActive = next.find((c) => !archivedContactIds.has(c.id));
        setActiveContactId(nextActive?.id ?? null);
      }
      return next;
    });
    setArchivedContactIds((prev) => { const n = new Set(prev); n.delete(contactId); return n; });
    setContactMenuId(null);
  };

  const handleToggleArchive = (contactId) => {
    setArchivedContactIds((prev) => {
      const next = new Set(prev);
      if (next.has(contactId)) {
        next.delete(contactId); // Unarchive
      } else {
        next.add(contactId); // Archive
        if (activeContactId === contactId) {
          const remaining = contacts.filter((c) => c.id !== contactId && !next.has(c.id));
          setActiveContactId(remaining[0]?.id ?? null);
        }
      }
      return next;
    });
    setContactMenuId(null);
  };

  // ─── Bluetooth / BLE handlers ────────────────────────────────────────────
  const handleStartBLEScan = async () => {
    setDiscoveredBLEDevices([]);
    setIsBluetoothScanning(true);
    const init = await initBLE();
    if (!init.ok) { setIsBluetoothScanning(false); return; }
    await startAdvertising("ChatterBox User");
    await startScanning((device) => {
      setDiscoveredBLEDevices((prev) => {
        const exists = prev.some((d) => d.deviceId === device.deviceId);
        return exists ? prev : [...prev, device];
      });
    });
  };

  const handleStopBLEScan = async () => {
    await stopScanning();
    setIsBluetoothScanning(false);
  };

  const handleAddBLEContact = async (device) => {
    const result = await connectAndGetIdentity(device.deviceId);
    const name = result.ok ? result.name : device.name;
    const avatar = result.ok ? result.avatar : null;
    const newContact = {
      id: device.deviceId,
      name,
      avatar,
      color: "bg-indigo-500",
      status: "BLE • Nearby",
      bleDeviceId: device.deviceId,
    };
    setContacts((prev) => [...prev, newContact]);
    // Listen for incoming BLE messages from this contact
    subscribeToMessages(device.deviceId, (deviceId, msg) => {
      setMessages((prev) => [
        ...prev,
        { ...msg, sender: "them", contactId: deviceId },
      ]);
    });
    setShowBluetoothModal(false);
  };

  // --- CHAT EFFECTS ---
  // This effect simulates receiving a reply from the other person after you send a message. It checks the last message sent by "me" and if it hasn't already triggered a reply, it sets timers to show a typing indicator and then add a reply message from "them". It also ensures that we don't trigger multiple replies for the same message by marking it as processed.
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];

    if (lastMessage?.sender === "me" && !lastMessage.isReplyGenerated) {
      // Mark as processed so we don't trigger infinite loops
      lastMessage.isReplyGenerated = true;

      const typingTimer = setTimeout(() => setIsTyping(true), 1500);

      const replyTimer = setTimeout(() => {
        const activeContact = contacts.find((c) => c.id === activeContactId);
        const reply = {
          id: Date.now(),
          text: `Hey! This is ${activeContact?.name}. Received your message: "${lastMessage.text}"`,
          sender: "them",
          contactId: activeContactId,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
        setMessages((prev) => [...prev, reply]);
        setIsTyping(false);
      }, 4000);

      return () => {
        clearTimeout(typingTimer);
        clearTimeout(replyTimer);
      };
    }
  }, [messages, activeContactId, contacts]);

  // Helper to get theme-based classes
  const themeClasses = {
    // Main background
    bg: theme === "dark" ? "bg-[#0b141a]" : "bg-[#f0f2f5]",

    // Sidebar items
    sidebarItem: theme === "dark" ? "text-[#e9edef] hover:bg-[#202c33]" : "text-[#111b21] hover:bg-[#f5f6f6]",

    // Message Bubbles
    incomingMsg: theme === "dark" ? "bg-[#202c33] text-[#e9edef]" : "bg-white text-[#111b21] shadow-sm border border-gray-100",

    // Subtext (Timestamps/Status)
    subtext: theme === "dark" ? "text-[#8696a0]" : "text-[#667781]",
  };

  // Function to scroll to the bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Watch for changes in the 'messages' array
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Close emoji picker on outside click
  useEffect(() => {
    if (!showEmojiPicker) return;
    const handler = (e) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(e.target)) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showEmojiPicker]);

  // Close contact context menu on outside click
  useEffect(() => {
    if (!contactMenuId) return;
    const handler = () => setContactMenuId(null);
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [contactMenuId]);

  // This function handles sending a new message in the chat.
  // It checks if the input is not empty, creates a new message object, updates the messages state, and clears the input field.
  const handleSendMessage = () => {
    if (newMessage.trim() === "") return;

    const msg = {
      id: Date.now(),
      text: newMessage,
      sender: "me",
      contactId: activeContactId, // TAG THE MESSAGE TO THE ACTIVE CHAT
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      status: "sent", // New property: 'sent', 'delivered', or 'read'
    };

    // Update the messages state by adding the new message to the existing array of messages.
    setMessages([...messages, msg]);
    setNewMessage("");

    // If the active contact was added via BLE, also send over Bluetooth
    const activeContact = contacts.find((c) => c.id === activeContactId);
    if (activeContact?.bleDeviceId) {
      sendBLEMessage(activeContact.bleDeviceId, msg);
    }
  };

  // This simulates the other person reading your message after 3 seconds
  // and updates messages status to "Read" after a delay with blue ticks.
  // It checks the last message sent by "me" and if it's still "sent", it updates it to "read" after 3 seconds.
  React.useEffect(() => {
    const lastMessage = messages[messages.length - 1];

    if (lastMessage?.sender === "me" && lastMessage.status === "sent") {
      const timer = setTimeout(() => {
        setMessages((prev) => prev.map((m) => (m.id === lastMessage.id ? { ...m, status: "read" } : m)));
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [messages]);

  // This function handles file uploads in the chat.
  // It creates a new message with the file information and updates the messages state.
  const fileInputRef = useRef(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // For now, we create a local URL to preview the image
    const fileUrl = URL.createObjectURL(file);
    const isImage = file.type.startsWith("image/");

    const msg = {
      id: Date.now(),
      text: file.name,
      fileUrl: fileUrl,
      type: isImage ? "image" : "file",
      sender: "me",
      contactId: activeContactId,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      status: "sent",
    };

    setMessages((prevMessages) => [...prevMessages, msg]);
    e.target.value = "";
  };

  // --- NEW VOICE NOTE FUNCTIONS START ---

  // 1. Add this state variable at the top of your component logic
  const [currentAudioTime, setCurrentAudioTime] = React.useState(0);
  const waveformContainerRef = useRef({}); // Refs for waveform containers to enable click-to-seek

  // Actual Recording Logic
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream; // Store so we can release the mic later

      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const source = audioContext.createMediaStreamSource(stream);
      const analyzer = audioContext.createAnalyser();
      analyzer.fftSize = 64; // 32 bins — enough for 10 visual bars
      analyzer.smoothingTimeConstant = 0.6;
      source.connect(analyzer);
      analyzerRef.current = analyzer;

      const bufferLength = analyzer.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const updateVisualizer = () => {
        if (!analyzerRef.current) return; // Exit when nulled by stop/cancel
        analyzerRef.current.getByteFrequencyData(dataArray);
        const bars = Array.from(dataArray.slice(0, 20)).map((v) => v / 255);
        setVisualizerData(bars);
        analyzerRafRef.current = requestAnimationFrame(updateVisualizer);
      };
      analyzerRafRef.current = requestAnimationFrame(updateVisualizer);

      mediaRecorder.current = new MediaRecorder(stream);
      mediaRecorder.current.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunks.current.push(e.data);
      };
      mediaRecorder.current.start(100); // Collect data every 100ms for smooth chunks
      setIsRecording(true);
      setRecordingTime(0);
      timerRef.current = setInterval(() => setRecordingTime((prev) => prev + 1), 1000);
    } catch (err) {
      alert("Microphone access denied!");
    }
  };

  const stopRecordingCleanup = () => {
    // Stop the visualizer RAF
    if (analyzerRafRef.current) cancelAnimationFrame(analyzerRafRef.current);
    analyzerRef.current = null;
    analyzerRafRef.current = null;
    // Release the microphone
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    clearInterval(timerRef.current);
  };

  const stopAndSendVoiceNote = () => {
    if (!mediaRecorder.current) return;
    const capturedDuration = recordingTime; // Capture before state reset
    const capturedContactId = activeContactId;

    mediaRecorder.current.onstop = async () => {
      const audioBlob = new Blob(audioChunks.current, { type: "audio/webm" });
      const audioUrl = URL.createObjectURL(audioBlob);
      const msgId = Date.now();

      // Generate REAL waveform from actual audio amplitude data
      let waveformData;
      try {
        const arrayBuffer = await audioBlob.arrayBuffer();
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        audioContext.close();
        waveformData = extractWaveformFromAudio(audioBuffer, 50);
      } catch {
        waveformData = generateWaveformData(capturedDuration);
      }

      const voiceMsg = {
        id: msgId,
        type: "voice",
        fileUrl: audioUrl,
        duration: capturedDuration,
        sender: "me",
        contactId: capturedContactId,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        status: "sent",
      };

      setVoiceWaveforms((prev) => ({ ...prev, [msgId]: waveformData }));
      setMessages((prev) => [...prev, voiceMsg]);
      audioChunks.current = [];
    };

    stopRecordingCleanup();
    mediaRecorder.current.stop();
    setIsRecording(false);
    setRecordingTime(0);
  };

  const cancelRecording = () => {
    if (mediaRecorder.current && isRecording) {
      mediaRecorder.current.onstop = null; // Prevent onstop from doing anything
      mediaRecorder.current.stop();
    }
    audioChunks.current = [];
    stopRecordingCleanup();
    setIsRecording(false);
    setRecordingTime(0);
  };

  // Fallback waveform (used if audio decoding fails)
  const generateWaveformData = (duration) => {
    const bars = 50;
    return Array.from({ length: bars }, (_, i) => {
      const base = 20 + Math.random() * 60;
      const wave = Math.sin(i * 0.3) * 15 + Math.cos(i * 0.7) * 10;
      return Math.max(8, Math.min(95, base + wave));
    });
  };

  // Real waveform: downsample peak amplitude from decoded AudioBuffer
  const extractWaveformFromAudio = (audioBuffer, numBars) => {
    const channelData = audioBuffer.getChannelData(0); // Use channel 0 (mono/left)
    const samplesPerBar = Math.floor(channelData.length / numBars);
    return Array.from({ length: numBars }, (_, i) => {
      let peak = 0;
      for (let j = 0; j < samplesPerBar; j++) {
        const sample = Math.abs(channelData[i * samplesPerBar + j]);
        if (sample > peak) peak = sample;
      }
      // Scale 0.0–1.0 amplitude to 8–95% height
      return Math.max(8, Math.min(95, 8 + peak * 87));
    });
  };

  // Playback Logic — no rAF loop, only ontimeupdate (fires ~4×/sec, zero extra render cost)
  const togglePlayVoiceNote = (id, url, duration) => {
    const player = audioPlayerRef.current;

    if (playingAudioId === id) {
      // Pause current
      player.pause();
      setPlayingAudioId(null);
      return;
    }

    // Stop whatever was playing before
    player.pause();

    // Ensure waveform exists
    if (!voiceWaveforms[id]) {
      setVoiceWaveforms((prev) => ({ ...prev, [id]: generateWaveformData(duration) }));
    }

    // Wire up handlers BEFORE play() to avoid missing early events
    player.ontimeupdate = () => setCurrentAudioTime(player.currentTime);
    player.onended = () => {
      setPlayingAudioId(null);
      setCurrentAudioTime(0);
      setPlaybackSpeed((prev) => ({ ...prev, [id]: 1 }));
    };
    player.onpause = null; // Remove — was causing stale-closure bugs

    player.src = url;
    player.playbackRate = playbackSpeed[id] || 1;
    setCurrentAudioTime(0);
    setPlayingAudioId(id);
    player.play();
  };

  // Click-to-seek: works while playing OR paused
  const handleWaveformClick = (e, msgId, url, duration) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const seekTime = pct * (duration || 0);

    if (playingAudioId === msgId) {
      // Already playing — just seek
      audioPlayerRef.current.currentTime = seekTime;
      setCurrentAudioTime(seekTime);
    } else {
      // Start playing from seek position
      togglePlayVoiceNote(msgId, url, duration);
      // Give the player a tick to load, then seek
      setTimeout(() => {
        audioPlayerRef.current.currentTime = seekTime;
        setCurrentAudioTime(seekTime);
      }, 0);
    }
  };

  // Toggle playback speed (1x -> 1.5x -> 2x -> 1x) per message
  const togglePlaybackSpeed = (e, msgId) => {
    e.stopPropagation();
    const currentSpeed = playbackSpeed[msgId] || 1;
    const newSpeed = currentSpeed === 1 ? 1.5 : currentSpeed === 1.5 ? 2 : 1;
    setPlaybackSpeed((prev) => ({ ...prev, [msgId]: newSpeed }));

    if (audioPlayerRef.current && playingAudioId === msgId) {
      audioPlayerRef.current.playbackRate = newSpeed;
    }
  };

  const formatTime = (seconds) => {
    const s = seconds || 0;
    const mins = Math.floor(s / 60);
    const secs = Math.floor(s % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };
  // --- NEW VOICE NOTE FUNCTIONS END ---

  // This function allows users to add emojis to their message input.
  const addEmoji = (emoji) => {
    setNewMessage((prev) => prev + emoji);
    // Optional: Auto-close after picking? Usually, WhatsApp stays open.
  };

  // 1. Dashboard Screen (Dark Mode - To match the color aesthetic of Whatsapp)
  if (isUnlocked) {
    return (
      <div className={`flex h-screen overflow-hidden font-sans relative transition-colors duration-500 ${theme === "dark" ? "bg-[#0f1117] text-white" : "bg-[#f8fafc] text-gray-900"}`}>
        {/* DYNAMIC BACKGROUND BLUR NODES */}
        <div className={`absolute top-[-10%] left-[20%] w-[600px] h-[600px] rounded-full blur-[120px] animate-pulse pointer-events-none ${theme === "dark" ? "bg-violet-900/20" : "bg-violet-500/5"}`}></div>
        <div className={`absolute bottom-[10%] right-[5%] w-[500px] h-[500px] rounded-full blur-[150px] pointer-events-none ${theme === "dark" ? "bg-indigo-900/15" : "bg-indigo-500/5"}`}></div>

        {/* 📱 1. ULTRA-MODERN SIDEBAR (Glass Panel) */}
        <aside className="w-[340px] m-4 mr-0 rounded-[2.5rem] flex flex-col shadow-2xl z-20 overflow-hidden" style={{ background: "linear-gradient(145deg, #4f46e5 0%, #7c3aed 55%, #6d28d9 100%)" }}>
          {/* Decorative blobs inside sidebar */}
          <div className="absolute rounded-full pointer-events-none" style={{ width: 260, height: 260, background: "rgba(255,255,255,0.06)", top: "-60px", right: "-60px" }} />
          <div className="absolute rounded-full pointer-events-none" style={{ width: 180, height: 180, background: "rgba(255,255,255,0.04)", bottom: "20%", left: "-60px" }} />

          {/* Top Branding/Profile Area */}
          <div className="p-6 flex items-center justify-between relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{ backgroundColor: "rgba(255,255,255,0.2)", backdropFilter: "blur(10px)" }}>
                <svg viewBox="0 0 24 24" width="20" height="20" fill="white">
                  <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-lg font-black tracking-tighter text-white">ChatterBox</h1>
                <p className="text-[10px] uppercase tracking-[0.2em] font-bold" style={{ color: "rgba(255,255,255,0.5)" }}>
                  Workspace
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {/* Bluetooth Discovery Button */}
              <button
                onClick={() => setShowBluetoothModal(true)}
                title="Find nearby ChatterBox users via Bluetooth"
                className="w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:bg-blue-400/20"
                style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
              >
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6.5 6.5 17.5 17.5 12 23 12 1 17.5 6.5 6.5 17.5" />
                </svg>
              </button>
              {/* Logout Button */}
              <button onClick={() => setIsUnlocked(false)} title="Log out" className="w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:bg-red-500/20" style={{ backgroundColor: "rgba(255,255,255,0.15)" }}>
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Search Capsule */}
          <div className="px-6 pb-3 relative z-10">
            <div className="rounded-2xl flex items-center px-4 py-3" style={{ backgroundColor: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.2)" }}>
              <span className="mr-3" style={{ color: "rgba(255,255,255,0.6)" }}>🔍</span>
              <input type="text" placeholder="Search conversations..." className="bg-transparent w-full outline-none text-sm font-medium text-white placeholder:text-white/50" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
          </div>

          {/* New Chat Button */}
          <div className="px-5 pb-4 relative z-10">
            <button
              onClick={() => setShowAddContactModal(true)}
              className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-2xl transition-all hover:bg-white/20 active:scale-[0.98]"
              style={{ backgroundColor: "rgba(255,255,255,0.1)", border: "1.5px dashed rgba(255,255,255,0.3)" }}
            >
              <div className="w-6 h-6 rounded-full flex items-center justify-center bg-white/25 flex-shrink-0">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="white"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
              </div>
              <span className="text-white/80 text-sm font-semibold">New Chat</span>
            </button>
          </div>

          {/* Contact List — active (non-archived) */}
          <div className="flex-1 overflow-y-auto px-3 custom-scrollbar relative z-10">
            {contacts
              .filter((c) => !archivedContactIds.has(c.id) && c.name.toLowerCase().includes(searchTerm.toLowerCase()))
              .map((contact) => (
                <div
                  key={contact.id}
                  onClick={() => setActiveContactId(contact.id)}
                  className="group flex items-center gap-3 p-3 mb-1.5 rounded-[1.6rem] transition-all duration-200 cursor-pointer relative"
                  style={{
                    backgroundColor: activeContactId === contact.id ? "rgba(255,255,255,0.2)" : contactMenuId === contact.id ? "rgba(255,255,255,0.12)" : "transparent",
                    border: activeContactId === contact.id ? "1px solid rgba(255,255,255,0.3)" : "1px solid transparent",
                    transform: activeContactId === contact.id ? "translateX(4px)" : "",
                  }}
                  onMouseEnter={(e) => {
                    if (activeContactId !== contact.id && contactMenuId !== contact.id) e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.1)";
                  }}
                  onMouseLeave={(e) => {
                    if (activeContactId !== contact.id && contactMenuId !== contact.id) e.currentTarget.style.backgroundColor = "transparent";
                  }}
                >
                  {/* Avatar */}
                  <label className="relative w-11 h-11 flex-shrink-0 cursor-pointer group/avatar" onClick={(e) => e.stopPropagation()} title="Change photo">
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleAvatarUpload(contact.id, e.target.files[0])} />
                    {contact.avatar ? (
                      <img src={contact.avatar} alt={contact.name} className="w-11 h-11 rounded-2xl object-cover shadow-lg" />
                    ) : (
                      <div className={`w-11 h-11 rounded-2xl ${contact.color} flex items-center justify-center shadow-lg`}>
                        <span className="text-white font-black text-base">{contact.name.charAt(0)}</span>
                      </div>
                    )}
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full border-2 border-violet-600 z-10" />
                    <div className="absolute inset-0 rounded-2xl bg-black/50 flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity z-10">
                      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                        <circle cx="12" cy="13" r="4" />
                      </svg>
                    </div>
                  </label>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-0.5">
                      <h3 className="font-bold text-sm truncate text-white">{contact.name}</h3>
                      <span className="text-[9px] font-bold italic flex-shrink-0 ml-1" style={{ color: "rgba(255,255,255,0.5)" }}>12:45</span>
                    </div>
                    <p className="text-[11px] font-medium truncate" style={{ color: "rgba(255,255,255,0.55)" }}>
                      {contact.status || "Online • Secure"}
                    </p>
                  </div>

                  {/* Three-dot context menu trigger */}
                  <div className="flex-shrink-0 relative" onClick={(e) => e.stopPropagation()}>
                    <button
                      className="w-7 h-7 rounded-xl flex items-center justify-center text-white/60 hover:text-white hover:bg-white/20 transition-all opacity-0 group-hover:opacity-100"
                      onClick={(e) => { e.stopPropagation(); setContactMenuId(contactMenuId === contact.id ? null : contact.id); }}
                      title="Options"
                    >
                      <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor">
                        <circle cx="12" cy="5" r="1.8"/><circle cx="12" cy="12" r="1.8"/><circle cx="12" cy="19" r="1.8"/>
                      </svg>
                    </button>

                    {/* Dropdown */}
                    {contactMenuId === contact.id && (
                      <div
                        className="absolute right-0 top-9 w-44 rounded-2xl overflow-hidden shadow-2xl z-50"
                        style={{ background: "linear-gradient(145deg,#1e1b4b,#2e1065)", border: "1px solid rgba(255,255,255,0.12)" }}
                        onMouseDown={(e) => e.stopPropagation()}
                      >
                        <button
                          className="w-full flex items-center gap-3 px-4 py-3 text-sm text-white/80 hover:bg-white/10 transition-colors text-left"
                          onClick={() => handleToggleArchive(contact.id)}
                        >
                          <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-400">
                            <polyline points="21 8 21 21 3 21 3 8"/><rect x="1" y="3" width="22" height="5"/><line x1="10" y1="12" x2="14" y2="12"/>
                          </svg>
                          <span>Archive Chat</span>
                        </button>
                        <div style={{ height: "1px", background: "rgba(255,255,255,0.08)", margin: "0 12px" }} />
                        <button
                          className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition-colors text-left"
                          onClick={() => handleDeleteContact(contact.id)}
                        >
                          <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
                          </svg>
                          <span>Delete Chat</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}

            {/* Archived section */}
            {(() => {
              const archived = contacts.filter((c) => archivedContactIds.has(c.id) && c.name.toLowerCase().includes(searchTerm.toLowerCase()));
              if (archived.length === 0) return null;
              return (
                <div className="mt-2">
                  <button
                    onClick={() => setShowArchivedSection((v) => !v)}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-2xl transition-all hover:bg-white/10 mb-1"
                  >
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: "rgba(255,255,255,0.15)" }}>
                      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="21 8 21 21 3 21 3 8"/><rect x="1" y="3" width="22" height="5"/><line x1="10" y1="12" x2="14" y2="12"/>
                      </svg>
                    </div>
                    <span className="text-white/70 text-xs font-bold uppercase tracking-wider flex-1 text-left">Archived ({archived.length})</span>
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" className="text-white/40 transition-transform" style={{ transform: showArchivedSection ? "rotate(180deg)" : "rotate(0deg)" }}>
                      <polyline points="6 9 12 15 18 9"/>
                    </svg>
                  </button>

                  {showArchivedSection && archived.map((contact) => (
                    <div
                      key={contact.id}
                      onClick={() => setActiveContactId(contact.id)}
                      className="group flex items-center gap-3 p-3 mb-1 rounded-[1.6rem] transition-all duration-200 cursor-pointer relative"
                      style={{
                        backgroundColor: activeContactId === contact.id ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(255,255,255,0.08)",
                      }}
                      onMouseEnter={(e) => { if (activeContactId !== contact.id) e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.1)"; }}
                      onMouseLeave={(e) => { if (activeContactId !== contact.id) e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.05)"; }}
                    >
                      {contact.avatar ? (
                        <img src={contact.avatar} alt={contact.name} className="w-10 h-10 rounded-2xl object-cover shadow-md flex-shrink-0 opacity-70" />
                      ) : (
                        <div className={`w-10 h-10 rounded-2xl ${contact.color} flex items-center justify-center shadow-md flex-shrink-0 opacity-70`}>
                          <span className="text-white font-black text-sm">{contact.name.charAt(0)}</span>
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm truncate text-white/60">{contact.name}</h3>
                        <p className="text-[10px] text-white/35 font-medium">Archived</p>
                      </div>
                      {/* Unarchive + Delete */}
                      <div className="flex-shrink-0 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                        <button onClick={() => handleToggleArchive(contact.id)} title="Unarchive" className="w-7 h-7 rounded-xl flex items-center justify-center hover:bg-white/20 text-amber-400 transition-all">
                          <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.5"/></svg>
                        </button>
                        <button onClick={() => handleDeleteContact(contact.id)} title="Delete" className="w-7 h-7 rounded-xl flex items-center justify-center hover:bg-red-500/20 text-red-400 transition-all">
                          <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M9 6V4h6v2"/></svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>
        </aside>

        {/* 💬 2. FLOATING MESSAGING HUB */}
        <main className="flex-1 m-4 flex flex-col relative z-10">
          {/* Floating Header */}
          {isSharingContact && (
            <div className="fixed inset-0 flex items-center justify-center z-[200] p-4" style={{ backgroundColor: "rgba(15,23,42,0.5)", backdropFilter: "blur(6px)", animation: "emojiPickerIn 0.2s cubic-bezier(0.34,1.4,0.64,1)" }} onClick={() => setIsSharingContact(false)}>
              <div className="w-full max-w-sm rounded-3xl overflow-hidden" style={{ boxShadow: "0 30px 80px rgba(99,102,241,0.25), 0 8px 32px rgba(0,0,0,0.15)" }} onClick={(e) => e.stopPropagation()}>
                {/* Violet gradient header */}
                <div className="p-6 flex justify-between items-center relative overflow-hidden" style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>
                  <div className="absolute rounded-full pointer-events-none" style={{ width: 140, height: 140, background: "rgba(255,255,255,0.07)", top: "-60px", right: "-40px" }} />
                  <div className="relative z-10">
                    <h3 className="text-white font-black text-lg tracking-tight">Share a Contact</h3>
                    <p className="text-white/60 text-xs mt-0.5">Choose who to share</p>
                  </div>
                  <button onClick={() => setIsSharingContact(false)} className="relative z-10 w-8 h-8 rounded-xl flex items-center justify-center transition-all hover:bg-white/20" style={{ background: "rgba(255,255,255,0.15)" }}>
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>

                {/* Contact list */}
                <div className={`max-h-[360px] overflow-y-auto p-3 custom-scrollbar ${theme === "dark" ? "bg-[#1a1f2e]" : "bg-white"}`}>
                  {contacts.map((contact, idx) => (
                    <div
                      key={contact.id}
                      onClick={() => {
                        handleShareContact(contact);
                        setIsSharingContact(false);
                      }}
                      className={`flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all duration-150 active:scale-[0.98] ${theme === "dark" ? "hover:bg-violet-500/10" : "hover:bg-violet-50"}`}
                    >
                      {/* Avatar */}
                      {contact.avatar ? (
                        <img src={contact.avatar} alt={contact.name} className="w-12 h-12 rounded-2xl object-cover flex-shrink-0 shadow-md" />
                      ) : (
                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-lg flex-shrink-0 shadow-md" style={{ background: `linear-gradient(135deg, ${["#6366f1,#8b5cf6", "#7c3aed,#a855f7", "#4f46e5,#6366f1"][idx % 3]})` }}>
                          {contact.name.charAt(0)}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className={`font-bold text-sm truncate ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{contact.name}</p>
                        <p className={`text-xs truncate mt-0.5 ${theme === "dark" ? "text-gray-400" : "text-gray-400"}`}>{contact.phone || "Online • Secure"}</p>
                      </div>
                      {/* Arrow indicator */}
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-violet-400 flex-shrink-0">
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className={`px-5 py-3 border-t ${theme === "dark" ? "bg-[#111827] border-gray-800" : "bg-gray-50 border-gray-100"}`}>
                  <p className={`text-[11px] text-center ${theme === "dark" ? "text-gray-500" : "text-gray-400"}`}>Contact info will be shared in the chat</p>
                </div>
              </div>
            </div>
          )}

          {/* ─── Bluetooth Discovery Modal ─────────────────────────────── */}
          {showBluetoothModal && (
            <div
              className="fixed inset-0 flex items-center justify-center z-[200] p-4"
              style={{ backgroundColor: "rgba(15,23,42,0.55)", backdropFilter: "blur(6px)", animation: "emojiPickerIn 0.2s cubic-bezier(0.34,1.4,0.64,1)" }}
              onClick={() => { handleStopBLEScan(); setShowBluetoothModal(false); }}
            >
              <div className="w-full max-w-sm rounded-3xl overflow-hidden" style={{ boxShadow: "0 30px 80px rgba(59,130,246,0.25), 0 8px 32px rgba(0,0,0,0.15)" }} onClick={(e) => e.stopPropagation()}>

                {/* Header */}
                <div className="p-6 flex justify-between items-center relative overflow-hidden" style={{ background: "linear-gradient(135deg, #3b82f6, #6366f1)" }}>
                  <div className="absolute rounded-full pointer-events-none" style={{ width: 140, height: 140, background: "rgba(255,255,255,0.07)", top: "-60px", right: "-40px" }} />
                  <div className="relative z-10 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ backgroundColor: "rgba(255,255,255,0.2)" }}>
                      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="6.5 6.5 17.5 17.5 12 23 12 1 17.5 6.5 6.5 17.5" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-white font-black text-lg tracking-tight">Bluetooth Nearby</h3>
                      <p className="text-white/60 text-xs mt-0.5">Find ChatterBox users around you</p>
                    </div>
                  </div>
                  <button
                    onClick={() => { handleStopBLEScan(); setShowBluetoothModal(false); }}
                    className="relative z-10 w-8 h-8 rounded-xl flex items-center justify-center transition-all hover:bg-white/20"
                    style={{ background: "rgba(255,255,255,0.15)" }}
                  >
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>

                {/* Body */}
                <div className={`p-5 ${theme === "dark" ? "bg-[#1a1f2e]" : "bg-white"}`}>

                  {/* Native platform guard */}
                  {!isNativePlatform() ? (
                    <div className="flex flex-col items-center gap-3 py-6 text-center">
                      <div className="w-16 h-16 rounded-3xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #dbeafe, #ede9fe)" }}>
                        <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="6.5 6.5 17.5 17.5 12 23 12 1 17.5 6.5 6.5 17.5" />
                        </svg>
                      </div>
                      <p className={`font-bold text-sm ${theme === "dark" ? "text-white" : "text-gray-800"}`}>Device Bluetooth Required</p>
                      <p className={`text-xs leading-relaxed ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                        Install ChatterBox on Android or iOS to discover nearby users over Bluetooth without internet.
                      </p>
                      <div className="mt-1 px-4 py-2 rounded-2xl text-xs font-bold text-blue-600 border border-blue-200 bg-blue-50">
                        Build with: npx cap add android
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* Scanning animation */}
                      <div className="flex flex-col items-center gap-4 py-4">
                        <div className="relative w-20 h-20 flex items-center justify-center">
                          {isBluetoothScanning && (
                            <>
                              <div className="absolute w-20 h-20 rounded-full border-2 border-blue-400/40 animate-ping" style={{ animationDuration: "1.5s" }} />
                              <div className="absolute w-14 h-14 rounded-full border-2 border-blue-400/60 animate-ping" style={{ animationDuration: "1.5s", animationDelay: "0.3s" }} />
                            </>
                          )}
                          <div className="w-10 h-10 rounded-2xl flex items-center justify-center z-10" style={{ background: "linear-gradient(135deg, #3b82f6, #6366f1)" }}>
                            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="6.5 6.5 17.5 17.5 12 23 12 1 17.5 6.5 6.5 17.5" />
                            </svg>
                          </div>
                        </div>
                        <p className={`text-xs font-semibold ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                          {isBluetoothScanning ? "Scanning for nearby users..." : "Tap scan to start"}
                        </p>
                        <button
                          onClick={isBluetoothScanning ? handleStopBLEScan : handleStartBLEScan}
                          className="px-6 py-2.5 rounded-2xl text-sm font-bold text-white transition-all active:scale-95"
                          style={{ background: isBluetoothScanning ? "linear-gradient(135deg, #ef4444, #dc2626)" : "linear-gradient(135deg, #3b82f6, #6366f1)" }}
                        >
                          {isBluetoothScanning ? "Stop Scanning" : "Start Scanning"}
                        </button>
                      </div>

                      {/* Discovered devices list */}
                      <div className={`max-h-[220px] overflow-y-auto mt-2 custom-scrollbar rounded-2xl ${theme === "dark" ? "bg-gray-900/40" : "bg-gray-50"} ${discoveredBLEDevices.length > 0 ? "p-2" : ""}`}>
                        {discoveredBLEDevices.length === 0 ? (
                          isBluetoothScanning && (
                            <p className={`text-center text-xs py-4 ${theme === "dark" ? "text-gray-500" : "text-gray-400"}`}>
                              Listening for nearby ChatterBox users...
                            </p>
                          )
                        ) : (
                          discoveredBLEDevices.map((device) => {
                            const bars = device.rssi > -60 ? 4 : device.rssi > -75 ? 3 : device.rssi > -85 ? 2 : 1;
                            const alreadyAdded = contacts.some((c) => c.id === device.deviceId);
                            return (
                              <div key={device.deviceId} className={`flex items-center gap-3 p-3 rounded-2xl mb-1 ${theme === "dark" ? "hover:bg-white/5" : "hover:bg-white"} transition-colors`}>
                                <div className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: "linear-gradient(135deg, #3b82f6, #6366f1)" }}>
                                  <span className="text-white font-black text-base">{device.name.charAt(0)}</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className={`font-bold text-sm truncate ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{device.name}</p>
                                  {/* Signal bars */}
                                  <div className="flex items-end gap-0.5 mt-0.5">
                                    {[1, 2, 3, 4].map((b) => (
                                      <div key={b} className="rounded-sm" style={{ width: 3, height: 4 + b * 2, backgroundColor: b <= bars ? "#3b82f6" : (theme === "dark" ? "#374151" : "#d1d5db") }} />
                                    ))}
                                    <span className={`text-[10px] ml-1 font-medium ${theme === "dark" ? "text-gray-500" : "text-gray-400"}`}>{device.rssi} dBm</span>
                                  </div>
                                </div>
                                <button
                                  onClick={() => !alreadyAdded && handleAddBLEContact(device)}
                                  disabled={alreadyAdded}
                                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all active:scale-95 ${alreadyAdded ? "opacity-50 cursor-default bg-gray-200 text-gray-500" : "bg-blue-500 hover:bg-blue-600 text-white"}`}
                                >
                                  {alreadyAdded ? "Added" : "Add"}
                                </button>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </>
                  )}
                </div>

                {/* Footer */}
                <div className={`px-5 py-3 border-t ${theme === "dark" ? "bg-[#111827] border-gray-800" : "bg-gray-50 border-gray-100"}`}>
                  <p className={`text-[11px] text-center ${theme === "dark" ? "text-gray-500" : "text-gray-400"}`}>Both devices must have ChatterBox open</p>
                </div>
              </div>
            </div>
          )}

          {/* ─── Add New Contact Modal ─────────────────────────────────── */}
          {showAddContactModal && (
            <div
              className="fixed inset-0 flex items-center justify-center z-[200] p-4"
              style={{ backgroundColor: "rgba(15,23,42,0.55)", backdropFilter: "blur(6px)", animation: "emojiPickerIn 0.2s cubic-bezier(0.34,1.4,0.64,1)" }}
              onClick={() => setShowAddContactModal(false)}
            >
              <div className="w-full max-w-sm rounded-3xl overflow-hidden" style={{ boxShadow: "0 30px 80px rgba(99,102,241,0.3), 0 8px 32px rgba(0,0,0,0.2)" }} onClick={(e) => e.stopPropagation()}>

                {/* Header */}
                <div className="p-6 flex justify-between items-center relative overflow-hidden" style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>
                  <div className="absolute rounded-full pointer-events-none" style={{ width: 140, height: 140, background: "rgba(255,255,255,0.07)", top: "-60px", right: "-40px" }} />
                  <div className="relative z-10 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ backgroundColor: "rgba(255,255,255,0.2)" }}>
                      <svg viewBox="0 0 24 24" width="20" height="20" fill="white"><path d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                    </div>
                    <div>
                      <h3 className="text-white font-black text-lg tracking-tight">New Chat</h3>
                      <p className="text-white/60 text-xs mt-0.5">Add a new conversation</p>
                    </div>
                  </div>
                  <button onClick={() => setShowAddContactModal(false)} className="relative z-10 w-8 h-8 rounded-xl flex items-center justify-center transition-all hover:bg-white/20" style={{ background: "rgba(255,255,255,0.15)" }}>
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  </button>
                </div>

                {/* Form body */}
                <div className={`p-6 flex flex-col gap-4 ${theme === "dark" ? "bg-[#1a1f2e]" : "bg-white"}`}>
                  {/* Name */}
                  <div>
                    <label className={`text-xs font-bold uppercase tracking-wider mb-1.5 block ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>Name *</label>
                    <input
                      type="text"
                      placeholder="e.g. Alice Johnson"
                      autoFocus
                      value={newContactName}
                      onChange={(e) => setNewContactName(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleAddContact()}
                      className={`w-full px-4 py-3 rounded-2xl text-sm font-medium outline-none border transition-colors ${theme === "dark" ? "bg-gray-800/60 border-gray-700 text-white placeholder:text-gray-500 focus:border-violet-500" : "bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-violet-400"}`}
                    />
                  </div>

                  {/* Status / subtitle */}
                  <div>
                    <label className={`text-xs font-bold uppercase tracking-wider mb-1.5 block ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>Status (optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. Online • Secure"
                      value={newContactPhone}
                      onChange={(e) => setNewContactPhone(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleAddContact()}
                      className={`w-full px-4 py-3 rounded-2xl text-sm font-medium outline-none border transition-colors ${theme === "dark" ? "bg-gray-800/60 border-gray-700 text-white placeholder:text-gray-500 focus:border-violet-500" : "bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-violet-400"}`}
                    />
                  </div>

                  {/* Color picker */}
                  <div>
                    <label className={`text-xs font-bold uppercase tracking-wider mb-2 block ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>Avatar Color</label>
                    <div className="flex gap-2 flex-wrap">
                      {CONTACT_COLORS.map((color) => (
                        <button
                          key={color}
                          onClick={() => setNewContactColor(color)}
                          className={`w-8 h-8 rounded-xl ${color} transition-all hover:scale-110 active:scale-95 flex items-center justify-center`}
                          style={{ boxShadow: newContactColor === color ? "0 0 0 3px white, 0 0 0 5px #8b5cf6" : "none" }}
                        >
                          {newContactColor === color && (
                            <svg viewBox="0 0 24 24" width="14" height="14" fill="white"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer / CTA */}
                <div className={`px-6 py-4 flex gap-3 border-t ${theme === "dark" ? "bg-[#111827] border-gray-800" : "bg-gray-50 border-gray-100"}`}>
                  <button onClick={() => setShowAddContactModal(false)} className={`flex-1 py-2.5 rounded-2xl text-sm font-bold transition-all active:scale-95 ${theme === "dark" ? "bg-gray-800 text-gray-300 hover:bg-gray-700" : "bg-gray-200 text-gray-600 hover:bg-gray-300"}`}>
                    Cancel
                  </button>
                  <button
                    onClick={handleAddContact}
                    disabled={!newContactName.trim()}
                    className="flex-1 py-2.5 rounded-2xl text-sm font-bold text-white transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
                    style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}
                  >
                    Add Chat
                  </button>
                </div>
              </div>
            </div>
          )}

          <header className={`p-4 rounded-[2rem] mb-4 flex items-center justify-between shadow-md border transition-colors duration-500 ${theme === "dark" ? "bg-[#1a1f2e] border-gray-800" : "bg-white border-gray-200"}`}>
            {(() => {
              const activeContact = contacts.find((c) => c.id === activeContactId);
              return (
                <div className="flex items-center gap-4 ml-2">
                  {activeContact?.avatar ? (
                    <img src={activeContact.avatar} alt={activeContact?.name} className="w-10 h-10 rounded-xl object-cover shadow-inner" />
                  ) : (
                    <div className={`w-10 h-10 ${activeContact?.color} rounded-xl shadow-inner flex items-center justify-center`}>
                      <span className="text-white font-black text-sm">{activeContact?.name?.charAt(0)}</span>
                    </div>
                  )}
                  <div>
                    <h2 className={`text-sm font-black tracking-tight ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{activeContact?.name}</h2>
                    <p className={`text-[10px] font-bold uppercase tracking-widest animate-pulse ${theme === "dark" ? "text-violet-400" : "text-violet-600"}`}>● Active Now</p>
                  </div>
                </div>
              );
            })()}

            {/* Theme Toggle */}
            <div className={`flex items-center p-1.5 rounded-2xl border mr-2 ${theme === "dark" ? "bg-gray-900/60 border-gray-700" : "bg-gray-50 border-gray-200"}`}>
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className={`w-9 h-9 flex items-center justify-center rounded-xl transition-all duration-300 hover:scale-110 ${theme === "dark" ? "hover:bg-violet-500/20" : "hover:bg-violet-500/10"}`}
                title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              >
                {theme === "dark" ? (
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#fbbf24" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="5" />
                    <line x1="12" y1="1" x2="12" y2="3" />
                    <line x1="12" y1="21" x2="12" y2="23" />
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                    <line x1="1" y1="12" x2="3" y2="12" />
                    <line x1="21" y1="12" x2="23" y2="12" />
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#7c3aed" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                  </svg>
                )}
              </button>
            </div>
          </header>

          {/* Message Viewport */}
          <div className={`flex-1 rounded-[2.5rem] border overflow-hidden relative shadow-md transition-colors duration-500 ${theme === "dark" ? "bg-[#111827] border-gray-800" : "bg-white border-gray-100"}`}>
            <div className="absolute inset-0 pointer-events-none grayscale opacity-[0.02]" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/cubes.png')" }}></div>

            <div className="h-full overflow-y-auto p-8 flex flex-col gap-6 custom-scrollbar relative z-10">
              {messages
                .filter((m) => m.contactId === activeContactId || !m.contactId)
                .map((msg) => (
                  <div key={msg.id} className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`p-4 shadow-xl transition-all duration-300 w-fit max-w-[80%] rounded-[2rem] ${msg.sender === "me" ? "text-white" : theme === "dark" ? "bg-[#1f2937] text-gray-100 border border-gray-700" : "bg-[#f1f5f9] text-gray-900 border border-gray-200"}`}
                      style={msg.sender === "me" ? { background: "linear-gradient(135deg, #6366f1, #8b5cf6)" } : undefined}
                    >
                      {msg.type === "voice" ? (
                        <div className={`flex items-center gap-3 min-w-[280px] sm:min-w-[320px] py-2 px-1 ${theme === "dark" ? "" : ""}`}>
                          {/* WhatsApp-style Speed Badge - Clickable */}
                          <button
                            onClick={(e) => togglePlaybackSpeed(e, msg.id)}
                            className={`flex-shrink-0 rounded-full w-9 h-9 flex items-center justify-center text-[11px] font-bold border transition-all hover:scale-110 active:scale-95 ${
                              msg.sender === "me" ? "bg-white/25 text-white border-white/30 hover:bg-white/35" : theme === "dark" ? "bg-gray-700 text-gray-200 border-gray-600 hover:bg-gray-600" : "bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300"
                            }`}
                          >
                            {(playbackSpeed[msg.id] || 1) === 1 ? "1x" : (playbackSpeed[msg.id] || 1) === 1.5 ? "1.5x" : "2x"}
                          </button>

                          {/* WhatsApp-style Play/Pause Button */}
                          <button onClick={() => togglePlayVoiceNote(msg.id, msg.fileUrl, msg.duration)} className={`flex-shrink-0 w-10 h-10 flex items-center justify-center transition-transform active:scale-95 rounded-full ${msg.sender === "me" ? "hover:bg-white/20" : "hover:bg-black/5"}`}>
                            {playingAudioId === msg.id ? (
                              <div className="flex gap-1">
                                <div className={`w-[3px] h-5 rounded-full ${msg.sender === "me" ? "bg-white" : "bg-gray-700"}`}></div>
                                <div className={`w-[3px] h-5 rounded-full ${msg.sender === "me" ? "bg-white" : "bg-gray-700"}`}></div>
                              </div>
                            ) : (
                              <div className={`ml-1 w-0 h-0 border-y-[10px] border-y-transparent ${msg.sender === "me" ? "border-l-[16px] border-l-white" : "border-l-[16px] border-l-gray-700"}`}></div>
                            )}
                          </button>

                          <div className="flex-1 flex flex-col pt-1 min-w-0">
                            {/* Waveform — no transitions to avoid re-render cost */}
                            <div
                              ref={(el) => (waveformContainerRef.current[msg.id] = el)}
                              onClick={(e) => handleWaveformClick(e, msg.id, msg.fileUrl, msg.duration)}
                              className="flex items-end gap-[2px] h-8 mb-1 cursor-pointer px-1"
                            >
                              {(voiceWaveforms[msg.id] || Array.from({ length: 50 }, (_, i) => 20 + Math.sin(i) * 15 + Math.random() * 20)).map((height, i) => {
                                const totalBars = voiceWaveforms[msg.id]?.length || 50;
                                const progress = (currentAudioTime / (msg.duration || 1)) * totalBars;
                                const isPlayed = playingAudioId === msg.id && i < progress;
                                // Scrubber head: the 1 bar at the current position
                                const isHead = playingAudioId === msg.id && Math.floor(progress) === i;
                                return (
                                  <div
                                    key={i}
                                    style={{
                                      width: "2.5px",
                                      height: `${height}%`,
                                      minHeight: "4px",
                                      borderRadius: "9999px",
                                      flexShrink: 0,
                                      backgroundColor: isHead
                                        ? msg.sender === "me" ? "rgba(255,255,255,1)" : "#7c3aed"
                                        : isPlayed
                                        ? msg.sender === "me" ? "rgba(255,255,255,0.95)" : "#8b5cf6"
                                        : msg.sender === "me" ? "rgba(255,255,255,0.35)" : "rgba(156,163,175,0.6)",
                                      transform: isHead ? "scaleY(1.15)" : "none",
                                    }}
                                  />
                                );
                              })}
                            </div>

                            {/* Timer and Status */}
                            <div className="flex justify-between items-center pr-1">
                              <span className={`text-[10px] font-medium tabular-nums ${msg.sender === "me" ? "text-white/80" : "text-gray-500"}`}>{playingAudioId === msg.id ? formatTime(currentAudioTime) : formatTime(msg.duration)}</span>
                              <div className="flex items-center gap-1.5">
                                <span className={`text-[9px] font-bold ${msg.sender === "me" ? "text-white/60" : "text-gray-400"}`}>{msg.time}</span>
                                {msg.sender === "me" && (
                                  <span className="flex items-center ml-1">
                                    {msg.status === "read" ? (
                                      /* WhatsApp Blue Double Ticks */
                                      <svg viewBox="0 0 20 12" width="16" height="11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M2 7L5 10L12 3" stroke="#53BDEB" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M6 7L9 10L16 3" stroke="#53BDEB" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                      </svg>
                                    ) : msg.status === "delivered" ? (
                                      /* Double Gray Ticks */
                                      <svg viewBox="0 0 20 12" width="16" height="11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M2 7L5 10L12 3" stroke="rgba(255,255,255,0.7)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M6 7L9 10L16 3" stroke="rgba(255,255,255,0.7)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                      </svg>
                                    ) : (
                                      /* Single Gray Tick */
                                      <svg viewBox="0 0 20 12" width="16" height="11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M2 7L5 10L12 3" stroke="rgba(255,255,255,0.6)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                      </svg>
                                    )}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col gap-2">
                          {/* Image/File/Text Logic */}
                          {/* 1. Insert the check for "contact" type here */}
                          {msg.type === "contact" ? (
                            <div className="flex flex-col gap-3 min-w-[220px] p-1">
                              <div className={`flex items-center gap-3 pb-3 ${msg.sender === "me" ? "border-b border-white/20" : "border-b border-gray-200"}`}>
                                {/* Avatar */}
                                {msg.avatar ? (
                                  <img src={msg.avatar} alt={msg.text} className="w-11 h-11 rounded-full object-cover shadow-inner flex-shrink-0" />
                                ) : (
                                  <div className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-inner flex-shrink-0" style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>
                                    {msg.text?.charAt(0)}
                                  </div>
                                )}
                                <div className="flex-1">
                                  <p className={`text-[14px] font-bold ${msg.sender === "me" ? "text-white" : "text-gray-900"}`}>{msg.text}</p>
                                  <p className={`text-[10px] uppercase tracking-wider font-black ${msg.sender === "me" ? "text-white/60" : "text-gray-400"}`}>Contact</p>
                                </div>
                              </div>

                              {/* Action Button to start a chat with the shared contact */}
                              <button
                                className={`w-full py-2 rounded-xl text-[12px] font-bold transition-all active:scale-95 ${msg.sender === "me" ? "bg-white/10 hover:bg-white/20 border border-white/20 text-white" : "bg-violet-50 hover:bg-violet-100 border border-violet-200 text-violet-700"}`}
                                onClick={() => console.log("Messaging:", msg.phone)}
                              >
                                Message
                              </button>
                            </div>
                          ) : msg.type === "image" ? (
                            <img src={msg.fileUrl} alt="attachment" className="max-w-[240px] rounded-2xl cursor-pointer" />
                          ) : msg.type === "file" ? (
                            <div className="flex items-center gap-3 bg-black/10 p-3 rounded-2xl">
                              <span className="text-white">📄</span>
                              <p className="text-[13px] font-bold truncate">{msg.text}</p>
                            </div>
                          ) : (
                            <p className="text-[14px] leading-relaxed font-medium">{msg.text}</p>
                          )}

                          {/* --- THE FIX: UNIFORM TICK CATALOGUE --- */}
                          <div className="flex items-center justify-end gap-1.5 mt-1 text-[9px] font-bold">
                            <span className={msg.sender === "me" ? "text-white/70" : "text-gray-500"}>{msg.time}</span>

                            {msg.sender === "me" && (
                              <span className="flex items-center ml-1">
                                {msg.status === "read" ? (
                                  /* WhatsApp-style blue double ticks */
                                  <svg viewBox="0 0 20 12" width="16" height="11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M2 7L5 10L12 3" stroke="#53BDEB" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M6 7L9 10L16 3" stroke="#53BDEB" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                  </svg>
                                ) : msg.status === "delivered" ? (
                                  /* Double gray ticks */
                                  <svg viewBox="0 0 20 12" width="16" height="11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M2 7L5 10L12 3" stroke="rgba(255,255,255,0.75)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M6 7L9 10L16 3" stroke="rgba(255,255,255,0.75)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                  </svg>
                                ) : (
                                  /* Single gray tick */
                                  <svg viewBox="0 0 20 12" width="16" height="11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M2 7L5 10L12 3" stroke="rgba(255,255,255,0.6)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                  </svg>
                                )}
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Floating Input Pod */}
          <footer className="mt-4 flex items-end gap-2 p-2 max-w-5xl mx-auto w-full">
            {/* 1. THE MAIN CAPSULE (White/Gray background) */}
            <div className={`flex-1 flex items-center gap-2 px-3 py-2 rounded-[1.5rem] shadow-sm border ${theme === "dark" ? "bg-[#1a1f2e] border-gray-700" : "bg-white border-gray-200"}`}>
              {/* ── Emoji Picker ── */}
              {showEmojiPicker && (
                <div
                  ref={emojiPickerRef}
                  className={`absolute bottom-[4.5rem] left-0 w-[22rem] border rounded-2xl flex flex-col overflow-hidden z-50 ${theme === "dark" ? "bg-[#1a1f2e] border-gray-700" : "bg-white border-gray-200"}`}
                  style={{ animation: "emojiPickerIn 0.22s cubic-bezier(0.34,1.4,0.64,1)", boxShadow: "0 20px 60px rgba(99,102,241,0.15), 0 4px 20px rgba(0,0,0,0.1)" }}
                >
                  {/* Search */}
                  <div className={`px-3 pt-3 pb-2 border-b ${theme === "dark" ? "bg-[#111827] border-gray-700" : "bg-gray-50 border-gray-100"}`}>
                    <div className={`flex items-center gap-2 rounded-xl px-3 py-2 border focus-within:border-violet-400 transition-colors ${theme === "dark" ? "bg-[#1a1f2e] border-gray-600" : "bg-white border-gray-200"}`}>
                      <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" className={theme === "dark" ? "text-gray-500 shrink-0" : "text-gray-400 shrink-0"}>
                        <circle cx="11" cy="11" r="8" />
                        <path d="m21 21-4.35-4.35" />
                      </svg>
                      <input
                        type="text"
                        placeholder="Search emoji…"
                        value={emojiSearch}
                        onChange={(e) => setEmojiSearch(e.target.value)}
                        className={`flex-1 bg-transparent text-[13px] outline-none border-none ${theme === "dark" ? "text-gray-200 placeholder:text-gray-500" : "text-gray-700 placeholder:text-gray-400"}`}
                      />
                      {emojiSearch && (
                        <button onClick={() => setEmojiSearch("")} className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] transition-all ${theme === "dark" ? "bg-gray-600 hover:bg-gray-500 text-gray-300" : "bg-gray-200 hover:bg-gray-300 text-gray-500 hover:text-gray-700"}`}>
                          ✕
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Category label */}
                  <div className="flex items-center gap-2.5 px-3.5 py-1.5">
                    <span className="text-[9.5px] font-black tracking-[0.15em] uppercase text-violet-500">{emojiSearch ? "Results" : EMOJI_CATEGORIES[activeEmojiTab].name}</span>
                    <div className={`flex-1 h-px ${theme === "dark" ? "bg-gray-700" : "bg-gray-100"}`} />
                  </div>

                  {/* Emoji grid */}
                  <div className="overflow-y-auto px-2 pb-2" style={{ height: "14rem", scrollbarWidth: "thin", scrollbarColor: "#d1d5db transparent" }}>
                    {(() => {
                      const list = emojiSearch ? EMOJI_CATEGORIES.flatMap((c) => c.emojis).filter((e) => (EMOJI_KEYWORDS[e] || "").toLowerCase().includes(emojiSearch.toLowerCase())) : EMOJI_CATEGORIES[activeEmojiTab].emojis;
                      return list.length > 0 ? (
                        <div className="grid grid-cols-8 gap-0.5">
                          {list.map((emoji, i) => (
                            <button
                              key={`${emoji}-${i}`}
                              onClick={() => setNewMessage((prev) => prev + emoji)}
                              className={`w-9 h-9 text-2xl rounded-xl flex items-center justify-center hover:scale-[1.2] active:scale-95 transition-all duration-100 ${theme === "dark" ? "hover:bg-white/10" : "hover:bg-violet-100"}`}
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full gap-2">
                          <span className="text-4xl opacity-20">🔍</span>
                          <p className={`text-[11px] ${theme === "dark" ? "text-gray-500" : "text-gray-400"}`}>No results for "{emojiSearch}"</p>
                        </div>
                      );
                    })()}
                  </div>

                  {/* Category tab bar */}
                  <div className={`flex items-center justify-around border-t px-2 py-1.5 ${theme === "dark" ? "bg-[#111827] border-gray-700" : "bg-gray-50 border-gray-100"}`}>
                    {EMOJI_CATEGORIES.map((cat, i) => {
                      const isActive = activeEmojiTab === i && !emojiSearch;
                      return (
                        <button
                          key={cat.name}
                          onClick={() => {
                            setActiveEmojiTab(i);
                            setEmojiSearch("");
                          }}
                          title={cat.name}
                          className={`relative w-8 h-8 rounded-xl flex items-center justify-center text-[1.1rem] transition-all duration-200 ${isActive ? (theme === "dark" ? "bg-violet-500/20 scale-110" : "bg-violet-100 scale-110") : theme === "dark" ? "hover:bg-white/10 opacity-40 hover:opacity-80" : "hover:bg-gray-200 opacity-40 hover:opacity-80"}`}
                        >
                          {cat.icon}
                          {isActive && <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-violet-500 rounded-full" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
              {/* Emoji Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowEmojiPicker((prev) => !prev);
                }}
                className={`p-1 transition-colors ${showEmojiPicker ? "text-violet-600" : "text-gray-500 hover:text-violet-600"}`}
              >
                <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                  <path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5s.67 1.5 1.5 1.5zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"></path>
                </svg>
              </button>

              {isRecording ? (
                /* RECORDING STATE — WhatsApp style */
                <div className="flex-1 flex items-center gap-3 px-1">
                  {/* Red dot + timer */}
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-red-500 font-semibold text-sm tabular-nums w-[38px]">{formatTime(recordingTime)}</span>
                  </div>
                  {/* Live waveform — 20 bars from analyser */}
                  <div className="flex items-center gap-[2px] flex-1 h-8">
                    {visualizerData.map((v, i) => (
                      <div
                        key={i}
                        style={{
                          width: "2.5px",
                          height: `${Math.max(15, v * 100)}%`,
                          minHeight: "4px",
                          borderRadius: "9999px",
                          backgroundColor: "#ef4444",
                          opacity: 0.5 + v * 0.5,
                          flexShrink: 0,
                        }}
                      />
                    ))}
                  </div>
                  {/* Cancel */}
                  <button onClick={cancelRecording} className="flex items-center gap-1 text-[11px] font-bold text-gray-400 uppercase tracking-wider hover:text-red-500 flex-shrink-0 transition-colors">
                    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6" /></svg>
                    Cancel
                  </button>
                </div>
              ) : (
                /* NORMAL STATE: Input + Attachment */
                <>
                  <input
                    type="text"
                    placeholder="Message"
                    className={`flex-1 bg-transparent border-none focus:ring-0 py-1 text-[16px] outline-none ${theme === "dark" ? "text-white placeholder:text-gray-500" : "text-gray-900 placeholder:text-gray-400"}`}
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    onFocus={() => setShowEmojiPicker(false)}
                  />

                  {/* Attachment (Clip) */}
                  <button onClick={() => fileInputRef.current?.click()} className="p-1 -rotate-45 transition-colors text-gray-500 hover:text-violet-600">
                    <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                      <path d="M16.5 6v11.5c0 2.21-1.79 4-4 4s-4-1.79-4-4V5c0-1.38 1.12-2.5 2.5-2.5s2.5 1.12 2.5 2.5v10.5c0 .55-.45 1-1 1s-1-.45-1-1V6H10v9.5c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5V5c0-2.21-1.79-4-4-4s-4 1.79-4 4v12.5c0 3.31 2.69 6 6 6s6-2.69 6-6V6h-1.5z"></path>
                    </svg>
                  </button>

                  {/* HIDDEN INPUT BRIDGE */}
                  <input type="file" ref={fileInputRef} onChange={handleFileUpload} style={{ display: "none" }} accept="image/,application/pdf" />

                  {/* Contacts (Profile) */}
                  {/* Contacts Sharing Button */}
                  {!newMessage && (
                    <button type="button" className="p-1 transition-colors text-gray-500 hover:text-violet-600" onClick={() => setIsSharingContact(true)}>
                      <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"></path>
                      </svg>
                    </button>
                  )}
                </>
              )}
            </div>

            {/* 2. THE ACTION CIRCLE (Floating on the right) */}
            <button
              onClick={(e) => {
                e.stopPropagation(); // Prevents the click from bubbling up to other elements
                if (newMessage.trim()) {
                  handleSendMessage();
                } else {
                  isRecording ? stopAndSendVoiceNote() : startRecording();
                }
              }}
              className={`w-12 h-12 rounded-full flex items-center justify-center text-white shadow-md transition-all flex-shrink-0 z-50 ${isRecording ? "bg-red-500 animate-pulse" : ""}`}
              style={isRecording ? undefined : { background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}
            >
              {newMessage.trim() ? (
                /* Send Arrow SVG */
                <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" className="ml-1">
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path>
                </svg>
              ) : (
                /* WhatsApp Microphone SVG */
                <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                  <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"></path>
                  <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"></path>
                </svg>
              )}
            </button>
          </footer>
        </main>
        {/* Audio playback is handled by the audioPlayerRef Audio() instance — no DOM element needed */}
      </div>
    );
  }

  return (
    <>
      {/* SPLIT SCREEN AUTH */}
      <div className="min-h-screen w-full flex font-sans">
        {/* LEFT PANEL */}
        <div className="hidden lg:flex lg:w-[45%] flex-col p-12 relative overflow-hidden" style={{ background: "linear-gradient(145deg, #4f46e5 0%, #7c3aed 55%, #6d28d9 100%)" }}>
          <div className="absolute rounded-full pointer-events-none" style={{ width: 440, height: 440, background: "rgba(255,255,255,0.07)", top: "-130px", right: "-110px" }} />
          <div className="absolute rounded-full pointer-events-none" style={{ width: 340, height: 340, background: "rgba(255,255,255,0.05)", bottom: "-90px", left: "-90px" }} />
          <div className="absolute rounded-full pointer-events-none" style={{ width: 200, height: 200, background: "rgba(255,255,255,0.04)", bottom: "30%", right: "8%" }} />

          <div className="relative z-10 flex items-center gap-3 mb-16">
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{ backgroundColor: "rgba(255,255,255,0.2)", backdropFilter: "blur(10px)" }}>
              <svg viewBox="0 0 24 24" width="22" height="22" fill="white">
                <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" />
              </svg>
            </div>
            <span className="text-white text-xl font-black tracking-tight">ChatterBox</span>
          </div>

          <div className="relative z-10 flex-1 flex flex-col justify-center">
            <h2 className="font-black text-white leading-[1.15] mb-5" style={{ fontSize: "2.5rem" }}>
              Connect with
              <br />
              the people that
              <br />
              matter most
            </h2>
            <p className="text-base mb-12 leading-relaxed max-w-xs" style={{ color: "rgba(255,255,255,0.65)" }}>
              Fast, secure messaging for teams and friends. Stay in sync wherever you are.
            </p>
            <div className="space-y-5">
              {[
                { icon: "💬", label: "Real-time messaging and emoji reactions" },
                { icon: "🔒", label: "End-to-end encrypted conversations" },
                { icon: "🎙️", label: "Voice messages and file sharing" },
              ].map((f) => (
                <div key={f.label} className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "rgba(255,255,255,0.15)", backdropFilter: "blur(10px)" }}>
                    <span className="text-lg">{f.icon}</span>
                  </div>
                  <span className="text-white text-sm font-semibold">{f.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative z-10 pt-8" style={{ borderTop: "1px solid rgba(255,255,255,0.12)" }}>
            <p className="text-xs mb-3" style={{ color: "rgba(255,255,255,0.45)" }}>
              Trusted by thousands of users worldwide
            </p>
            <div className="flex gap-8">
              {[
                ["50K+", "Active Users"],
                ["99.9%", "Uptime"],
                ["256-bit", "Encryption"],
              ].map(([val, lbl]) => (
                <div key={lbl}>
                  <p className="text-white font-black text-xl">{val}</p>
                  <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.45)" }}>
                    {lbl}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="flex-1 flex items-center justify-center p-8 lg:p-16 bg-white">
          {isVerifying ? (
            <div className="w-full max-w-sm">
              <div className="lg:hidden flex items-center gap-2 mb-8">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="white">
                    <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" />
                  </svg>
                </div>
                <span className="font-black text-gray-900">ChatterBox</span>
              </div>

              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6" style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)", boxShadow: "0 8px 24px rgba(99,102,241,0.3)" }}>
                <svg viewBox="0 0 24 24" width="26" height="26" fill="white">
                  <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" />
                </svg>
              </div>

              <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-1">Check your phone</h2>
              <p className="text-gray-400 text-sm mb-8">
                Enter the 6-digit code sent to <span className="font-bold text-violet-600">+{phone}</span>
              </p>

              <label className="block text-xs font-bold text-gray-400 uppercase tracking-[0.15em] mb-2">Verification Code</label>
              <input
                type="text"
                maxLength="6"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full text-center text-4xl tracking-[0.4em] font-mono py-5 rounded-2xl outline-none transition-all duration-200 mb-5"
                style={{ backgroundColor: "#f8fafc", color: "#1e293b", border: "2px solid #e2e8f0" }}
                onFocus={(e) => (e.target.style.borderColor = "#8b5cf6")}
                onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
                placeholder="000000"
              />

              <button
                onClick={handleVerifyOtp}
                className="w-full py-4 rounded-2xl font-bold text-white text-[15px] tracking-wide transition-all duration-200 active:scale-95 mb-4"
                style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)", boxShadow: "0 4px 20px rgba(99,102,241,0.3)" }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
              >
                Verify &amp; Sign In &rarr;
              </button>

              <div className="mb-5 text-center">{isExpired ? <p className="text-red-500 text-xs font-bold animate-pulse">CODE EXPIRED</p> : <p className="text-gray-400 text-xs">Valid for 3 minutes only</p>}</div>

              <button onClick={() => setIsVerifying(false)} className="text-gray-400 text-xs font-semibold transition-colors hover:text-violet-600">
                &larr; Use a different number
              </button>
            </div>
          ) : (
            <div className="w-full max-w-sm">
              <div className="lg:hidden flex items-center gap-2 mb-8">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="white">
                    <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" />
                  </svg>
                </div>
                <span className="font-black text-gray-900">ChatterBox</span>
              </div>

              <h1 className="font-black text-gray-900 tracking-tight mb-1" style={{ fontSize: "2rem" }}>
                Welcome back 👋
              </h1>
              <p className="text-gray-400 text-sm mb-8">Sign in to continue to ChatterBox</p>

              <label className="block text-xs font-bold text-gray-400 uppercase tracking-[0.15em] mb-2">Phone Number</label>
              <PhoneInput
                country={"ug"}
                value={phone}
                onChange={(p) => setPhone(p)}
                containerStyle={{ width: "100%", marginBottom: "20px" }}
                inputStyle={{
                  backgroundColor: "#f8fafc",
                  color: "#1e293b",
                  width: "100%",
                  height: "58px",
                  borderRadius: "14px",
                  border: "2px solid #e2e8f0",
                  fontSize: "16px",
                }}
                buttonStyle={{
                  backgroundColor: "#f8fafc",
                  border: "none",
                  borderRadius: "14px 0 0 14px",
                  paddingLeft: "10px",
                }}
                dropdownStyle={{
                  backgroundColor: "#ffffff",
                  color: "#1e293b",
                }}
              />

              <button
                onClick={handleRequestOtp}
                className="w-full active:scale-95 text-white font-bold py-4 rounded-2xl transition-all duration-200 text-[15px] tracking-wide mb-5"
                style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)", boxShadow: "0 4px 20px rgba(99,102,241,0.3)" }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
              >
                Continue &rarr;
              </button>

              <p className="text-center text-xs text-gray-400">
                By continuing you agree to our <span className="text-violet-600 font-semibold cursor-pointer hover:underline">Terms</span> &amp; <span className="text-violet-600 font-semibold cursor-pointer hover:underline">Privacy Policy</span>
              </p>
            </div>
          )}
        </div>
      </div>

      {/* OTP SIMULATION POPUP */}
      {showSimulation && (
        <div className="fixed inset-0 flex items-center justify-center z-[200] backdrop-blur-sm" style={{ backgroundColor: "rgba(15,23,42,0.45)" }}>
          <div className="max-w-sm w-full text-center mx-4 rounded-3xl p-10 bg-white" style={{ boxShadow: "0 30px 80px rgba(0,0,0,0.2)", border: "1px solid #f1f5f9" }}>
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 mx-auto" style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)", boxShadow: "0 8px 24px rgba(99,102,241,0.35)" }}>
              <svg viewBox="0 0 24 24" width="26" height="26" fill="white">
                <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
              </svg>
            </div>

            <h3 className="text-2xl font-black text-gray-900 tracking-tight mb-1">Your Access Code</h3>
            <p className="text-gray-400 text-sm mb-6">Use this code to verify your identity</p>

            <div className="py-7 rounded-2xl mb-6" style={{ backgroundColor: "#f5f3ff", border: "2px solid #ede9fe" }}>
              <span className="text-5xl font-mono font-black tracking-[0.15em] block" style={{ color: "#7c3aed" }}>
                {generatedOTP}
              </span>
            </div>

            <button
              onClick={() => {
                navigator.clipboard.writeText(generatedOTP);
                setShowSimulation(false);
                setIsVerifying(true);
              }}
              className="w-full py-4 text-white font-bold rounded-2xl transition-all active:scale-95 tracking-wide"
              style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)", boxShadow: "0 4px 20px rgba(99,102,241,0.35)" }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              Copy Code &amp; Continue &rarr;
            </button>

            <div className="mt-5 flex items-center justify-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: "#8b5cf6" }}></div>
              <span className="text-[11px] uppercase tracking-[0.2em] font-semibold text-gray-400">Simulation Mode</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default App;

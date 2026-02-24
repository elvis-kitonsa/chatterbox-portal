import React, { useState, useEffect, useRef } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { Sun, Moon } from "lucide-react";

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
  const [otp, setOtp] = useState("");
  const [generatedOTP, setGeneratedOTP] = useState(""); // Needed for simulation
  const [showSimulation, setShowSimulation] = useState(false); // Needed for modal
  const [isExpired, setIsExpired] = useState(false); // For OTP countdown

  // 2. CHAT & CONTACT STATES
  const [contacts, setContacts] = useState([
    { id: "tech-lead", name: "Tech Lead", status: "online", color: "bg-blue-500" },
    { id: "project-manager", name: "Project Manager", status: "last seen 2:00 PM", color: "bg-purple-500" },
    { id: "dev-team", name: "Dev Team Group", status: "Group Chat", color: "bg-orange-500" },
  ]);
  const [activeContactId, setActiveContactId] = useState("tech-lead"); // Track which contact is currently selected
  const [messages, setMessages] = useState([
    { id: 1, text: "Hey, how is the ChatterBox progress?", sender: "them", time: "1:05 PM" },
    { id: 2, text: "The login portal is merged into main!", sender: "me", time: "1:08 PM", status: "read" /*Options: "sent", "delivered", "read" */ },
    { id: 3, text: "Hello chat", sender: "me", time: "3:29 PM", status: "delivered" },
  ]);
  const [newMessage, setNewMessage] = useState(""); // This will be used to store the text of the new message being typed in the input field.
  const [searchTerm, setSearchTerm] = useState(""); // This will be used to implement the search functionality in the sidebar.

  // 3. UI & THEME STATES
  const [theme, setTheme] = useState("dark"); // Default to dark
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
  const audioPlayerRef = useRef(new Audio()); // Global audio player instance
  const analyzerRef = useRef(null); // This creates the hook we will use to grab the hidden input file
  const emojiPickerRef = useRef(null); // To track the picker and a useEffect to listen for clicks on the rest of the document

  // --- EMOJI DATA ---
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

  // Updated to trigger the Simulation Modal
  const handleRequestOtp = () => {
    if (phone && phone.length > 5) {
      // Create a random 6-digit code for the simulation
      const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOTP(newOtp);
      setShowSimulation(true); // This opens the "Secure Access" modal we built
    } else {
      alert("Please enter a valid phone number.");
    }
  };

  // Updated to check against the generated code
  const handleVerifyOtp = () => {
    // For development, let's use '123456' as our secret code
    if (otp === generatedOTP || otp === "123456") {
      setIsUnlocked(true);
      setIsVerifying(false);
    } else {
      alert("Invalid code. Check the simulation box!");
    }
  };

  const handleShareContact = (contact) => {
    const contactMsg = {
      id: Date.now(),
      sender: "me",
      type: "contact", // This triggers your contact card UI
      text: contact.name,
      phone: contact.phone,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      status: "sent",
      contactId: activeContactId,
    };
    setMessages([...messages, contactMsg]);
    setIsSharingContact(false);
  };

  // --- CHAT EFFECTS ---
  // This sets a typing indicator and simulates a reply from the other person after you send a message.
  // It checks if the last message was sent by "me" and then sets a timer to show "typing..." and another
  // timer to add a reply message after a delay.
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

      // --- WAVEFORM LOGIC START ---
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const source = audioContext.createMediaStreamSource(stream);
      const analyzer = audioContext.createAnalyser();
      analyzer.fftSize = 32; // Small size for a simple waveform
      source.connect(analyzer);
      analyzerRef.current = analyzer;

      const bufferLength = analyzer.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const updateVisualizer = () => {
        if (!analyzerRef.current) return;
        analyzerRef.current.getByteFrequencyData(dataArray);

        // We take a slice of the data and convert it to a small array for our bars
        const normalizedData = Array.from(dataArray.slice(0, 10)).map((v) => v / 255);
        setVisualizerData(normalizedData);
        requestAnimationFrame(updateVisualizer);
      };
      updateVisualizer();
      // --- WAVEFORM LOGIC END ---

      mediaRecorder.current = new MediaRecorder(stream);

      // ADD THIS: This actually collects the audio data as it's recorded
      mediaRecorder.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunks.current.push(e.data);
        }
      };

      // ... (rest of your existing mediaRecorder logic)
      mediaRecorder.current.start();
      setIsRecording(true);
      setRecordingTime(0);
      timerRef.current = setInterval(() => setRecordingTime((prev) => prev + 1), 1000);
    } catch (err) {
      alert("Microphone access denied!");
    }
  };

  const stopAndSendVoiceNote = () => {
    if (!mediaRecorder.current) return;

    mediaRecorder.current.onstop = () => {
      const audioBlob = new Blob(audioChunks.current, { type: "audio/webm" });
      const audioUrl = URL.createObjectURL(audioBlob);

      const voiceMsg = {
        id: Date.now(),
        type: "voice",
        fileUrl: audioUrl, // THE ACTUAL SOUND DATA
        duration: recordingTime,
        sender: "me",
        contactId: activeContactId,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        status: "sent",
      };

      // Generate waveform data for the new voice message
      setVoiceWaveforms((prev) => ({
        ...prev,
        [voiceMsg.id]: generateWaveformData(recordingTime),
      }));

      setMessages((prev) => [...prev, voiceMsg]);
      audioChunks.current = [];
    };

    mediaRecorder.current.stop();
    clearInterval(timerRef.current);
    setIsRecording(false);
    setRecordingTime(0);
  };

  // NEW: Cancellation Feature
  const cancelRecording = () => {
    if (mediaRecorder.current && isRecording) {
      mediaRecorder.current.stop(); // Stop recording
      audioChunks.current = []; // Wipe the data
    }
    clearInterval(timerRef.current);
    setIsRecording(false);
    setRecordingTime(0);
  };

  // Generate realistic waveform data for a voice message
  const generateWaveformData = (duration) => {
    const bars = 50; // WhatsApp uses around 50 bars
    const data = [];
    for (let i = 0; i < bars; i++) {
      // Create realistic voice waveform pattern
      const baseHeight = 20 + Math.random() * 60;
      const variation = Math.sin(i * 0.3) * 15 + Math.cos(i * 0.7) * 10;
      data.push(Math.max(15, Math.min(95, baseHeight + variation)));
    }
    return data;
  };

  // Playback Logic with speed control and seeking
  const togglePlayVoiceNote = (id, url, duration) => {
    if (playingAudioId === id) {
      audioPlayerRef.current.pause();
      setPlayingAudioId(null);
    } else {
      // Stop any currently playing audio
      if (playingAudioId) {
        audioPlayerRef.current.pause();
      }

      // Generate waveform if not exists
      if (!voiceWaveforms[id]) {
        setVoiceWaveforms((prev) => ({
          ...prev,
          [id]: generateWaveformData(duration),
        }));
      }

      setCurrentAudioTime(0);
      audioPlayerRef.current.src = url;
      const speed = playbackSpeed[id] || 1;
      audioPlayerRef.current.playbackRate = speed;
      audioPlayerRef.current.play();
      setPlayingAudioId(id);

      // Update timer and progress as audio plays
      const updateProgress = () => {
        if (audioPlayerRef.current) {
          setCurrentAudioTime(audioPlayerRef.current.currentTime);
          requestAnimationFrame(updateProgress);
        }
      };
      updateProgress();

      audioPlayerRef.current.ontimeupdate = () => {
        setCurrentAudioTime(audioPlayerRef.current.currentTime);
      };

      audioPlayerRef.current.onended = () => {
        setPlayingAudioId(null);
        setCurrentAudioTime(0);
        // Reset playback speed for this message
        setPlaybackSpeed((prev) => ({ ...prev, [id]: 1 }));
      };

      audioPlayerRef.current.onpause = () => {
        if (playingAudioId !== id) {
          setCurrentAudioTime(0);
        }
      };
    }
  };

  // Handle waveform click for seeking
  const handleWaveformClick = (e, msgId, duration) => {
    if (!playingAudioId || playingAudioId !== msgId) return;
    
    const container = e.currentTarget;
    const rect = container.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    const seekTime = percentage * duration;

    if (audioPlayerRef.current) {
      audioPlayerRef.current.currentTime = seekTime;
      setCurrentAudioTime(seekTime);
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
      <div className={`flex h-screen overflow-hidden transition-all duration-700 font-sans relative ${theme === "dark" ? "bg-[#080c0e] text-white" : "bg-gray-50 text-gray-900"}`}>
        {/* 🌌 DYNAMIC BACKGROUND BLUR NODES */}
        <div className="absolute top-[-10%] left-[20%] w-[600px] h-[600px] bg-[#00a884]/10 rounded-full blur-[120px] animate-pulse pointer-events-none"></div>
        <div className="absolute bottom-[10%] right-[5%] w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[150px] pointer-events-none"></div>

        {/* 📱 1. ULTRA-MODERN SIDEBAR (Glass Panel) */}
        <aside className={`w-[340px] m-4 mr-0 rounded-[2.5rem] border border-white/5 flex flex-col backdrop-blur-3xl shadow-2xl z-20 overflow-hidden ${theme === "dark" ? "bg-[#111b21]/40" : "bg-white/60"}`}>
          {/* Top Branding/Profile Area */}
          <div className="p-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-[#00a884] to-[#05cd99] rounded-2xl flex items-center justify-center shadow-lg shadow-[#00a884]/20 transform hover:rotate-6 transition-transform cursor-pointer">
                <span className="text-xl text-[#111b21]">💬</span>
              </div>
              <div>
                <h1 className="text-lg font-black tracking-tighter">
                  Chatter<span className="text-[#00a884]">Box</span>
                </h1>
                <p
                  className={`text-[10px] uppercase tracking-[0.2em] font-bold ${
                    theme === "dark" ? "text-gray-300" : "text-gray-500"
                  }`}
                >
                  Workspace
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsUnlocked(false)}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                theme === "dark"
                  ? "bg-white/5 hover:bg-red-500/10 hover:text-red-400"
                  : "bg-black/5 text-gray-600 hover:bg-red-50 hover:text-red-500"
              }`}
            >
              🔒
            </button>
          </div>

          {/* Search Capsule: For searching conversations and contacts within the sidebar */}
          <div className="px-6 pb-4">
            <div
              className={`rounded-2xl flex items-center px-4 py-3 shadow-inner ${
                theme === "dark" ? "bg-[#2a3942] border border-white/10" : "bg-white border-2 border-gray-300 shadow-sm"
              }`}
            >
              <span className={theme === "dark" ? "text-gray-400 mr-3" : "text-gray-600 mr-3"}>🔍</span>
              <input
                type="text"
                placeholder="Search conversations..."
                className={`bg-transparent w-full outline-none text-sm font-medium ${
                  theme === "dark" ? "text-white placeholder:text-gray-300" : "text-gray-900 placeholder:text-gray-700"
                }`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Modern List */}
          <div className="flex-1 overflow-y-auto px-3 custom-scrollbar">
            {contacts
              .filter((c) => c.name.toLowerCase().includes(searchTerm.toLowerCase()))
              .map((contact) => (
                <div
                  key={contact.id}
                  onClick={() => setActiveContactId(contact.id)}
                  className={`group flex items-center gap-4 p-4 mb-2 rounded-[1.8rem] transition-all duration-300 cursor-pointer border ${
                    activeContactId === contact.id
                      ? "bg-[#00a884]/10 border-[#00a884]/30 shadow-lg translate-x-1"
                      : theme === "dark"
                      ? "border-transparent hover:bg-white/5 hover:translate-x-1"
                      : "border-transparent hover:bg-gray-100 hover:translate-x-1"
                  }`}
                >
                  <div className={`w-12 h-12 rounded-2xl ${contact.color} flex-shrink-0 shadow-lg relative`}>
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#00a884] rounded-full border-2 border-[#111b21]"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-0.5">
                      {/* This makes the active name adapt to theme and selection */}
                      <h3
                        className={`font-bold text-sm truncate ${
                          theme === "dark"
                            ? activeContactId === contact.id
                              ? "text-white"
                              : "text-gray-300"
                            : activeContactId === contact.id
                            ? "text-gray-900"
                            : "text-gray-600"
                        }`}
                      >
                        {contact.name}
                      </h3>
                      <span className={`text-[9px] font-bold italic ${theme === "dark" ? "opacity-30 text-gray-300" : "text-gray-600"}`}>12:45</span>
                    </div>
                    <p className={`text-[11px] font-medium truncate ${theme === "dark" ? "opacity-40 text-gray-300" : "text-gray-700"}`}>Online • Secure</p>
                  </div>
                </div>
              ))}
          </div>
        </aside>

        {/* 💬 2. FLOATING MESSAGING HUB */}
        <main className="flex-1 m-4 flex flex-col relative z-10">
          {/* Floating Header */}
          {isSharingContact && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[200] p-4 animate-in fade-in duration-200">
              <div className="bg-[#202c33] w-full max-w-sm rounded-[2rem] border border-white/10 shadow-2xl overflow-hidden">
                <div className="p-6 border-b border-white/5 flex justify-between items-center bg-[#111b21]">
                  <h3 className="text-white font-black tracking-tight">Select Contact</h3>
                  <button onClick={() => setIsSharingContact(false)} className="text-gray-400 hover:text-white text-xl">
                    ✕
                  </button>
                </div>
                <div className="max-h-[400px] overflow-y-auto p-2 custom-scrollbar">
                  {contacts.map((contact) => (
                    <div
                      key={contact.id}
                      onClick={() => {
                        handleShareContact(contact);
                        setIsSharingContact(false); // Auto-close after selection
                      }}
                      className="flex items-center gap-4 p-4 hover:bg-white/5 rounded-2xl cursor-pointer transition-all active:scale-95"
                    >
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#00a884] to-[#05cd99] flex items-center justify-center text-[#111b21] font-bold text-lg">{contact.name.charAt(0)}</div>
                      <div>
                        <p className="text-white font-bold text-sm">{contact.name}</p>
                        <p className="text-gray-500 text-xs">{contact.phone}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          <header className={`p-4 rounded-[2rem] border border-white/5 backdrop-blur-xl mb-4 flex items-center justify-between shadow-xl ${theme === "dark" ? "bg-[#111b21]/40" : "bg-white/80 border-gray-200"}`}>
            {/* Active Contact Info remains the same */}
            {(() => {
              const activeContact = contacts.find((c) => c.id === activeContactId);
              return (
                <div className="flex items-center gap-4 ml-2">
                  <div className={`w-10 h-10 ${activeContact?.color} rounded-xl shadow-inner`}></div>
                  <div>
                    <h2 className={`text-sm font-black tracking-tight ${theme === "dark" ? "text-white" : "text-[#111b21]"}`}>{activeContact?.name}</h2>
                    <p className={`text-[10px] font-bold uppercase tracking-widest ${theme === "dark" ? "text-[#00a884] animate-pulse" : "text-[#00a884] font-semibold"}`}>● Active Now</p>
                  </div>
                </div>
              );
            })()}

            {/* 2. REPLACED THEME TOGGLE AREA */}
            <div className={`flex items-center gap-3 p-1.5 rounded-2xl border mr-2 ${
              theme === "dark" ? "bg-black/10 border-white/5" : "bg-gray-100 border-gray-300"
            }`}>
              <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className={`w-9 h-9 flex items-center justify-center rounded-xl transition-all duration-300 hover:scale-110 ${theme === "dark" ? "hover:bg-yellow-500/10" : "hover:bg-indigo-500/10"}`}>
                {theme === "dark" ? <Sun className="w-5 h-5 text-yellow-500" strokeWidth={2.5} /> : <Moon className="w-5 h-5 text-indigo-600" strokeWidth={2.5} />}
              </button>
            </div>
          </header>

          {/* Message Viewport - Floating Cards Style */}
          <div className={`flex-1 rounded-[2.5rem] border overflow-hidden relative shadow-2xl ${
            theme === "dark" ? "bg-[#0b141a]/60 border-white/5" : "bg-gray-50 border-gray-300"
          }`}>
            <div className={`absolute inset-0 pointer-events-none grayscale ${
              theme === "dark" ? "opacity-[0.03]" : "opacity-[0.02]"
            }`} style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/cubes.png')" }}></div>

            <div className="h-full overflow-y-auto p-8 flex flex-col gap-6 custom-scrollbar relative z-10">
              {messages
                .filter((m) => m.contactId === activeContactId || !m.contactId)
                .map((msg) => (
                  <div key={msg.id} className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`p-4 shadow-xl transition-all duration-300 w-fit max-w-[80%] rounded-[2rem] ${
                        msg.sender === "me"
                          ? theme === "dark"
                            ? "bg-[#054740] text-white shadow-[#054740]/20" // Dark theme: deep teal bubble
                            : "bg-[#d9fdd3] text-[#111b21] shadow-md" // Light theme: WhatsApp-style green bubble
                          : theme === "dark"
                          ? "bg-[#2a3942] text-white border-t border-white/10" // Dark theme: graphite bubble
                          : "bg-white text-[#111b21] border-2 border-gray-300 shadow-lg" // Light theme: white bubble with dark text and strong border
                      }`}
                    >
                      {msg.type === "voice" ? (
                        <div className={`flex items-center gap-3 min-w-[280px] sm:min-w-[320px] py-2 px-1 ${
                          theme === "dark" ? "" : ""
                        }`}>
                          {/* WhatsApp-style Speed Badge - Clickable */}
                          <button
                            onClick={(e) => togglePlaybackSpeed(e, msg.id)}
                            className={`flex-shrink-0 rounded-full w-9 h-9 flex items-center justify-center text-[11px] font-bold border transition-all hover:scale-110 active:scale-95 ${
                              theme === "dark"
                                ? "bg-white/10 text-white border-white/20 hover:bg-white/15"
                                : msg.sender === "me"
                                ? "bg-white/30 text-[#111b21] border-gray-300 hover:bg-white/40"
                                : "bg-gray-200 text-[#111b21] border-gray-300 hover:bg-gray-300"
                            }`}
                          >
                            {(playbackSpeed[msg.id] || 1) === 1 ? "1x" : (playbackSpeed[msg.id] || 1) === 1.5 ? "1.5x" : "2x"}
                          </button>

                          {/* WhatsApp-style Play/Pause Button */}
                          <button
                            onClick={() => togglePlayVoiceNote(msg.id, msg.fileUrl, msg.duration)}
                            className={`flex-shrink-0 w-10 h-10 flex items-center justify-center transition-transform active:scale-95 rounded-full hover:bg-black/5 ${
                              theme === "light" && msg.sender === "me" ? "hover:bg-white/20" : ""
                            }`}
                          >
                            {playingAudioId === msg.id ? (
                              <div className="flex gap-1">
                                <div className={`w-[3px] h-5 rounded-full ${
                                  theme === "dark" ? "bg-white" : "bg-[#111b21]"
                                }`}></div>
                                <div className={`w-[3px] h-5 rounded-full ${
                                  theme === "dark" ? "bg-white" : "bg-[#111b21]"
                                }`}></div>
                              </div>
                            ) : (
                              <div className={`ml-1 w-0 h-0 border-y-[10px] border-y-transparent ${
                                theme === "dark"
                                  ? "border-l-[16px] border-l-white"
                                  : "border-l-[16px] border-l-[#111b21]"
                              }`}></div>
                            )}
                          </button>

                          <div className="flex-1 flex flex-col pt-1 min-w-0">
                            {/* WhatsApp-style Interactive Waveform */}
                            <div
                              ref={(el) => (waveformContainerRef.current[msg.id] = el)}
                              onClick={(e) => handleWaveformClick(e, msg.id, msg.duration)}
                              className={`flex items-end gap-[2px] h-8 mb-1 cursor-pointer px-1 ${
                                theme === "light" && msg.sender === "me" ? "hover:opacity-80" : ""
                              }`}
                            >
                              {(voiceWaveforms[msg.id] || Array.from({ length: 50 }, () => 20 + Math.random() * 60)).map((height, i) => {
                                const time = playingAudioId === msg.id ? currentAudioTime : 0;
                                const duration = msg.duration || 5;
                                const totalBars = voiceWaveforms[msg.id]?.length || 50;
                                const progress = (time / duration) * totalBars;
                                const isPlayed = playingAudioId === msg.id && i < progress;
                                const isActive = playingAudioId === msg.id && Math.abs(i - progress) < 2;

                                return (
                                  <div
                                    key={i}
                                    className={`w-[2.5px] rounded-full transition-all duration-75 ${
                                      isPlayed
                                        ? theme === "dark"
                                          ? "bg-white"
                                          : msg.sender === "me"
                                          ? "bg-[#111b21]"
                                          : "bg-[#111b21]"
                                        : theme === "dark"
                                        ? "bg-white/30"
                                        : msg.sender === "me"
                                        ? "bg-[#111b21]/30"
                                        : "bg-[#111b21]/30"
                                    } ${isActive ? "opacity-100" : ""}`}
                                    style={{
                                      height: `${height}%`,
                                      minHeight: "4px",
                                      transition: isActive ? "height 0.1s ease-out" : "none",
                                    }}
                                  />
                                );
                              })}
                            </div>

                            {/* Timer and Status */}
                            <div className="flex justify-between items-center pr-1">
                              <span className={`text-[10px] font-medium tabular-nums ${
                                theme === "dark"
                                  ? "text-white/70"
                                  : msg.sender === "me"
                                  ? "text-[#111b21]/70"
                                  : "text-[#111b21]/70"
                              }`}>
                                {playingAudioId === msg.id ? formatTime(currentAudioTime) : formatTime(msg.duration)}
                              </span>
                              <div className="flex items-center gap-1.5">
                                <span className={`text-[9px] font-bold ${
                                  theme === "dark"
                                    ? "text-white/50"
                                    : msg.sender === "me"
                                    ? "text-[#111b21]/60"
                                    : "text-[#111b21]/60"
                                }`}>
                                  {msg.time}
                                </span>
                                {msg.sender === "me" && (
                                  <span className="flex items-center ml-1">
                                    {msg.status === "read" ? (
                                      /* WhatsApp Blue Double Ticks */
                                      <svg viewBox="0 0 20 12" width="16" height="11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M2 7L5 10L12 3" stroke="#53BDEB" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M6 7L9 10L16 3" stroke="#53BDEB" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                      </svg>
                                    ) : msg.status === "delivered" ? (
                                      /* WhatsApp Double Gray Ticks */
                                      <svg viewBox="0 0 20 12" width="16" height="11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path
                                          d="M2 7L5 10L12 3"
                                          stroke={theme === "dark" ? "rgba(255,255,255,0.7)" : "rgba(17,27,33,0.6)"}
                                          strokeWidth="1.8"
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                        />
                                        <path
                                          d="M6 7L9 10L16 3"
                                          stroke={theme === "dark" ? "rgba(255,255,255,0.7)" : "rgba(17,27,33,0.6)"}
                                          strokeWidth="1.8"
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                        />
                                      </svg>
                                    ) : (
                                      /* WhatsApp Single Gray Tick */
                                      <svg viewBox="0 0 20 12" width="16" height="11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path
                                          d="M2 7L5 10L12 3"
                                          stroke={theme === "dark" ? "rgba(255,255,255,0.6)" : "rgba(17,27,33,0.5)"}
                                          strokeWidth="1.8"
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                        />
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
                              <div className="flex items-center gap-3 border-b border-white/10 pb-3">
                                {/* Avatar with dynamic initial based on contact name */}
                                <div className="w-11 h-11 rounded-full bg-[#00a884] flex items-center justify-center text-white font-bold text-lg shadow-inner">{msg.text?.charAt(0)}</div>
                                <div className="flex-1">
                                  <p className="text-[14px] font-bold text-white">{msg.text}</p>
                                  <p className="text-[10px] text-white/50 uppercase tracking-wider font-black">Contact</p>
                                </div>
                              </div>

                              {/* Action Button to start a chat with the shared contact */}
                              <button className="w-full py-2 bg-white/5 hover:bg-white/10 rounded-xl text-[12px] font-bold transition-all border border-white/5 active:scale-95 text-white" onClick={() => console.log("Messaging:", msg.phone)}>
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
                            <span className={
                              msg.sender === "me" 
                                ? theme === "dark" ? "opacity-70 text-white" : "text-gray-600"
                                : theme === "dark" ? "text-gray-400" : "text-gray-600"
                            }>{msg.time}</span>

                            {msg.sender === "me" && (
                              <span className="flex items-center ml-1">
                                {msg.status === "read" ? (
                                  /* WhatsApp-style blue double ticks */
                                  <svg viewBox="0 0 20 12" width="16" height="11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M2 7L5 10L12 3" stroke="#53BDEB" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M6 7L9 10L16 3" stroke="#53BDEB" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                  </svg>
                                ) : msg.status === "delivered" ? (
                                  /* WhatsApp-style double gray ticks */
                                  <svg viewBox="0 0 20 12" width="16" height="11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                      d="M2 7L5 10L12 3"
                                      stroke={theme === "dark" ? "rgba(255,255,255,0.7)" : "rgba(17,27,33,0.6)"}
                                      strokeWidth="1.8"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                    <path
                                      d="M6 7L9 10L16 3"
                                      stroke={theme === "dark" ? "rgba(255,255,255,0.7)" : "rgba(17,27,33,0.6)"}
                                      strokeWidth="1.8"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                  </svg>
                                ) : (
                                  /* WhatsApp-style single gray tick */
                                  <svg viewBox="0 0 20 12" width="16" height="11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                      d="M2 7L5 10L12 3"
                                      stroke={theme === "dark" ? "rgba(255,255,255,0.6)" : "rgba(17,27,33,0.5)"}
                                      strokeWidth="1.8"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
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
            <div className={`flex-1 flex items-center gap-2 px-3 py-2 rounded-[1.5rem] shadow-sm ${theme === "dark" ? "bg-[#2a3942]" : "bg-white"}`}>
              {/* ── Emoji Picker ── */}
              {showEmojiPicker && (
                <div
                  ref={emojiPickerRef}
                  className="absolute bottom-[4.5rem] left-0 w-[22rem] bg-[#202c33] border border-white/[0.07] rounded-2xl flex flex-col overflow-hidden z-50"
                  style={{ animation: "emojiPickerIn 0.22s cubic-bezier(0.34,1.4,0.64,1)", boxShadow: "0 20px 60px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.04)" }}
                >
                  {/* Search */}
                  <div className="px-3 pt-3 pb-2 bg-[#111b21]">
                    <div className="flex items-center gap-2 bg-[#1f2c33] rounded-xl px-3 py-2 border border-white/[0.06] focus-within:border-[#00a884]/40 transition-colors">
                      <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-gray-500 shrink-0">
                        <circle cx="11" cy="11" r="8" />
                        <path d="m21 21-4.35-4.35" />
                      </svg>
                      <input type="text" placeholder="Search emoji…" value={emojiSearch} onChange={(e) => setEmojiSearch(e.target.value)} className="flex-1 bg-transparent text-[13px] text-gray-200 placeholder:text-gray-600 outline-none border-none" />
                      {emojiSearch && (
                        <button onClick={() => setEmojiSearch("")} className="w-4 h-4 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-[9px] text-gray-400 hover:text-white transition-all">
                          ✕
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Category label */}
                  <div className="flex items-center gap-2.5 px-3.5 py-1.5">
                    <span className="text-[9.5px] font-black tracking-[0.15em] uppercase text-[#00a884]">{emojiSearch ? "Results" : EMOJI_CATEGORIES[activeEmojiTab].name}</span>
                    <div className="flex-1 h-px bg-white/[0.06]" />
                  </div>

                  {/* Emoji grid */}
                  <div className="overflow-y-auto px-2 pb-2" style={{ height: "14rem", scrollbarWidth: "thin", scrollbarColor: "#2a3942 transparent" }}>
                    {(() => {
                      const list = emojiSearch ? EMOJI_CATEGORIES.flatMap((c) => c.emojis).filter((e) => (EMOJI_KEYWORDS[e] || "").toLowerCase().includes(emojiSearch.toLowerCase())) : EMOJI_CATEGORIES[activeEmojiTab].emojis;
                      return list.length > 0 ? (
                        <div className="grid grid-cols-8 gap-0.5">
                          {list.map((emoji, i) => (
                            <button key={`${emoji}-${i}`} onClick={() => setNewMessage((prev) => prev + emoji)} className="w-9 h-9 text-2xl rounded-xl flex items-center justify-center hover:bg-[#00a884]/15 hover:scale-[1.2] active:scale-95 transition-all duration-100">
                              {emoji}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full gap-2">
                          <span className="text-4xl opacity-20">🔍</span>
                          <p className="text-[11px] text-gray-600">No results for "{emojiSearch}"</p>
                        </div>
                      );
                    })()}
                  </div>

                  {/* Category tab bar */}
                  <div className="flex items-center justify-around border-t border-white/[0.06] bg-[#111b21] px-2 py-1.5">
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
                          className={`relative w-8 h-8 rounded-xl flex items-center justify-center text-[1.1rem] transition-all duration-200 ${isActive ? "bg-[#00a884]/20 scale-110" : "hover:bg-white/[0.06] opacity-30 hover:opacity-70"}`}
                        >
                          {cat.icon}
                          {isActive && <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#00a884] rounded-full" />}
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
                className={`p-1 transition-colors ${showEmojiPicker ? "text-[#00a884]" : "text-gray-400 hover:text-gray-200"}`}
              >
                <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                  <path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5s.67 1.5 1.5 1.5zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"></path>
                </svg>
              </button>

              {isRecording ? (
                /* RECORDING STATE: Show Timer & Visualizer inside capsule */
                <div className="flex-1 flex items-center justify-between px-2">
                  <span className="text-red-500 animate-pulse font-medium">{formatTime(recordingTime)}</span>
                  <div className="flex gap-0.5 items-center h-4">
                    {visualizerData.map((v, i) => (
                      <div key={i} className="w-0.5 bg-gray-400 rounded-full" style={{ height: `${Math.max(20, v * 100)}%` }} />
                    ))}
                  </div>
                  <button onClick={cancelRecording} className="text-[11px] font-bold text-gray-400 uppercase tracking-wider hover:text-red-500">
                    Slide to cancel
                  </button>
                </div>
              ) : (
                /* NORMAL STATE: Input + Attachment */
                <>
                  <input
                    type="text"
                    placeholder="Message"
                    className={`flex-1 bg-transparent border-none focus:ring-0 py-1 text-[16px] outline-none ${
                      theme === "dark" ? "text-white placeholder:text-gray-400" : "text-gray-900 placeholder:text-gray-700"
                    }`}
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    onFocus={() => setShowEmojiPicker(false)}
                  />

                  {/* Attachment (Clip) */}
                  <button onClick={() => fileInputRef.current?.click()} className={`p-1 -rotate-45 transition-colors ${
                    theme === "dark" ? "text-gray-400 hover:text-gray-200" : "text-gray-600 hover:text-gray-800"
                  }`}>
                    <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                      <path d="M16.5 6v11.5c0 2.21-1.79 4-4 4s-4-1.79-4-4V5c0-1.38 1.12-2.5 2.5-2.5s2.5 1.12 2.5 2.5v10.5c0 .55-.45 1-1 1s-1-.45-1-1V6H10v9.5c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5V5c0-2.21-1.79-4-4-4s-4 1.79-4 4v12.5c0 3.31 2.69 6 6 6s6-2.69 6-6V6h-1.5z"></path>
                    </svg>
                  </button>

                  {/* HIDDEN INPUT BRIDGE */}
                  <input type="file" ref={fileInputRef} onChange={handleFileUpload} style={{ display: "none" }} accept="image/,application/pdf" />

                  {/* Contacts (Profile) */}
                  {/* Contacts Sharing Button */}
                  {!newMessage && (
                    <button type="button" className={`p-1 transition-colors ${
                      theme === "dark" ? "text-gray-400 hover:text-gray-200" : "text-gray-600 hover:text-gray-800"
                    }`} onClick={() => setIsSharingContact(true)}>
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
              className={`w-12 h-12 rounded-full flex items-center justify-center text-white shadow-md transition-all flex-shrink-0 z-50 ${isRecording ? "bg-red-500 animate-pulse" : "bg-[#00a884]"}`}
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
        {/* Hidden Audio Engine */}
        <audio ref={audioPlayerRef} className="hidden" />
      </div>
    );
  }

  // OPTION 2: THE OTP VERIFICATION (Show this if they just clicked 'Send Code')
  if (isVerifying) {
    return (
      <div className="min-h-screen w-full bg-[#0b141a] flex items-center justify-center p-6 text-white font-sans">
        <div className="bg-[#202c33] p-12 rounded-[2.5rem] border border-[#00a884]/30 max-w-sm w-full text-center shadow-[0_20px_50px_rgba(0,0,0,0.4)] relative overflow-hidden">
          {/* Subtle Background Glow */}
          <div className="absolute -top-20 -left-20 w-40 h-40 bg-[#00a884]/5 rounded-full blur-3xl"></div>

          {/* Updated Chat Logo (Matches Login) */}
          <div className="w-16 h-16 bg-gradient-to-br from-[#00a884] to-[#05cd99] rounded-2xl flex items-center justify-center mb-8 mx-auto shadow-lg shadow-[#00a884]/20">
            <span className="text-3xl text-[#111b21]">💬</span>
          </div>

          <h2 className="text-3xl font-extrabold mb-2 tracking-tight">Verify it's you</h2>
          <p className="text-gray-400 text-sm mb-10 leading-relaxed">
            We sent a code to <br />
            <span className="text-[#00a884] font-bold">+{phone}</span>
          </p>

          <div className="group mb-8">
            <input
              type="text"
              maxLength="6"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full bg-[#2a3942] text-center text-4xl tracking-[0.4em] font-mono py-5 rounded-2xl border-2 border-transparent group-hover:border-gray-600 focus:border-[#00a884] outline-none transition-all duration-300 shadow-inner"
              placeholder="000000"
            />
          </div>

          <button onClick={handleVerifyOtp} className="w-full bg-[#00a884] hover:bg-[#05cd99] hover:scale-[1.02] hover:shadow-[0_10px_20px_rgba(0,168,132,0.3)] py-4 rounded-2xl font-black text-[#111b21] uppercase tracking-widest transition-all duration-300 active:scale-95 mb-4">
            Confirm Code
          </button>

          {/* Expiry Warning UI */}
          {/* Add a visual cue to indicate the code is about to expire */}
          <div className="mt-4">{isExpired ? <p className="text-red-500 text-xs font-bold animate-pulse">CODE EXPIRED</p> : <p className="text-gray-300 text-[10px] uppercase tracking-tighter">Valid for 3 minutes only</p>}</div>

          <button onClick={() => setIsVerifying(false)} className="text-gray-300 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors duration-200">
            ← Use different number
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#0b141a] flex items-center justify-center p-6 text-white font-sans">
      <div className="bg-[#202c33] p-10 rounded-[2.5rem] shadow-2xl border border-[#00a884]/20 max-w-sm w-full relative overflow-hidden group">
        {/* Dynamic Glow Effect */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#00a884]/10 rounded-full blur-3xl group-hover:bg-[#00a884]/20 transition-all duration-700"></div>

        {/* New Chat Logo */}
        <div className="w-20 h-20 bg-gradient-to-br from-[#00a884] to-[#05cd99] rounded-3xl flex items-center justify-center mb-8 mx-auto shadow-lg shadow-[#00a884]/20 transform transition-transform hover:rotate-6">
          <span className="text-4xl text-[#111b21]">💬</span>
        </div>

        <h1 className="text-4xl font-black text-white mb-2 text-center tracking-tight">
          Chatter<span className="text-[#00a884]">Box</span>
        </h1>
        <p className="text-gray-400 mb-10 text-center text-sm font-medium tracking-wide">Engage. Talk. Interact.</p>

        <div className="mb-8">
          <label className="text-[10px] font-bold text-[#00a884] uppercase tracking-[0.2em] ml-1 mb-2 block">Phone Number</label>
          <PhoneInput
            country={"ug"}
            value={phone}
            onChange={(p) => setPhone(p)}
            containerStyle={{ width: "100%" }}
            inputStyle={{
              backgroundColor: "#2a3942",
              color: "white",
              width: "100%",
              height: "60px",
              borderRadius: "18px",
              border: "2px solid transparent",
              fontSize: "16px",
            }}
            buttonStyle={{
              backgroundColor: "#2a3942",
              border: "none",
              borderRadius: "18px 0 0 18px",
              paddingLeft: "10px",
            }}
          />
        </div>

        <button onClick={handleRequestOtp} className="w-full bg-[#00a884] hover:bg-[#05cd99] hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(0,168,132,0.4)] active:scale-95 text-[#111b21] font-bold py-4 rounded-2xl transition-all duration-300 mb-4">
          Send Verification Code
        </button>
      </div>

      {showSimulation && (
        <div className="fixed inset-0 flex items-center justify-center z-[100] bg-[#0b141a]/95 backdrop-blur-md animate-in fade-in duration-300">
          {/* Main Card */}
          <div className="bg-[#111b21] border border-white/5 p-10 rounded-[2.5rem] max-w-sm w-full text-center shadow-[0_40px_80px_rgba(0,0,0,0.7)] relative overflow-hidden ring-1 ring-white/10">
            {/* Subtle brand glow in the background */}
            <div className="absolute -top-24 -left-24 w-64 h-64 bg-[#00a884]/10 rounded-full blur-[80px]"></div>

            <div className="relative z-10">
              {/* REPLACED: Shield is gone. Using your branded chat logo with a glow */}
              <div className="w-16 h-16 bg-gradient-to-br from-[#00a884] to-[#05cd99] rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-[0_0_20px_rgba(0,168,132,0.4)]">
                <span className="text-3xl filter drop-shadow-sm">💬</span>
              </div>

              <h3 className="text-white text-2xl font-black tracking-tight mb-2">Secure Access</h3>
              <p className="text-gray-400 text-sm mb-10 leading-relaxed font-medium">
                Confirm the code below to enter your <br />
                <span className="text-[#00a884] opacity-80 uppercase text-[10px] font-bold tracking-[0.2em]">verified workspace</span>
              </p>

              {/* Improved Code Box: Deeper contrast and neon text */}
              <div className="bg-[#202c33] py-8 rounded-[2rem] border border-white/5 mb-10 shadow-inner group">
                <span className="text-5xl font-mono font-black text-[#00a884] tracking-[0.15em] drop-shadow-[0_0_12px_rgba(0,168,132,0.3)] group-hover:scale-110 transition-transform duration-500 block">{generatedOTP}</span>
              </div>

              <button
                onClick={() => {
                  navigator.clipboard.writeText(generatedOTP);
                  setShowSimulation(false);
                  setIsVerifying(true);
                }}
                className="w-full py-5 bg-[#00a884] hover:bg-[#05cd99] text-[#111b21] font-bold rounded-2xl transition-all shadow-lg shadow-[#00a884]/20 uppercase text-xs tracking-[0.2em] active:scale-95"
              >
                Copy & Continue
              </button>

              <div className="mt-8 flex items-center justify-center gap-2">
                <div className="w-1.5 h-1.5 bg-[#00a884] rounded-full animate-pulse"></div>
                <span className="text-[10px] text-gray-300 uppercase tracking-[0.3em] font-bold">Secure Simulation</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
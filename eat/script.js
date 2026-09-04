(function () {
  "use strict";

  var CATEGORIES = [
    { id: "food", label: "อาหาร", emoji: "🍜" },
    { id: "drink", label: "เครื่องดื่ม", emoji: "🧋" },
    { id: "dessert", label: "ของหวาน", emoji: "🍰" },
  ];

  // ---------- ข้อมูลร้าน — แก้ไข/เพิ่มร้านได้ตรงนี้ ----------
  // lat/lng ต้องเป็นพิกัดของ "จุดเดียวกับที่ area สื่อถึง" เป๊ะๆ เพราะปุ่ม Google Maps ค้นหาจากชื่อร้าน+area
  // ถ้าพิกัดกับข้อความค้นหาคนละจุดกัน ระยะทางที่คำนวณ (ใกล้ฉัน) กับพิกัดที่ Maps เปิดจริงจะไม่ตรงกัน —
  // ร้านที่มีหลายสาขาจึงตั้ง area เป็นชื่อสาขาที่เจาะจงสาขาเดียว ไม่ใช้ "หลายสาขา" แบบกว้างๆ
  var RESTAURANTS = [
    // อาหาร
    { id: "jayfai", name: "เจ๊ไฝ (Jay Fai)", category: "food", area: "เสาชิงช้า", lat: 13.7526, lng: 100.5017, description: "ไข่เจียวปูและผัดขี้เมาทะเลระดับมิชลินสตาร์ ต้นตำรับสตรีทฟู้ดชื่อดังของกรุงเทพฯ", tags: ["มิชลิน", "สตรีทฟู้ด", "ไข่เจียวปู"], menu: ["ไข่เจียวปู", "ผัดขี้เมาทะเล", "ราดหน้าทะเล"] },
    { id: "thipsamai", name: "ทิพย์สมัย ผัดไทยประตูผี", category: "food", area: "ประตูผี", lat: 13.7538, lng: 100.5057, description: "ผัดไทยห่อไข่สูตรดั้งเดิมที่เปิดมากว่า 80 ปี เมนูต้องสั่งเมื่อมาเยือนย่านเมืองเก่า", tags: ["ผัดไทย", "ร้านเก่าแก่"], menu: ["ผัดไทยห่อไข่", "ผัดไทยกุ้งสด", "น้ำส้มคั้น"] },
    { id: "kruaapsorn", name: "ครัวอัปษร (Krua Apsorn)", category: "food", area: "ถนนดินสอ", lat: 13.7566, lng: 100.5017, description: "อาหารไทยรสมือแม่ เมนูเด็ดคือปูผัดผงกะหรี่และยำผักกระเฉดกุ้งสด", tags: ["อาหารไทย", "ปูผัดผงกะหรี่"], menu: ["ปูผัดผงกะหรี่", "ยำผักกระเฉดกุ้งสด", "ไข่เจียวหอยนางรม"] },
    { id: "somtamnua", name: "ส้มตำนัว สยามสแควร์", category: "food", area: "สยามสแควร์ ซอย 5", lat: 13.7458, lng: 100.5342, description: "ส้มตำและอาหารอีสานรสจัดจ้าน คิวยาวตลอดวันแต่คุ้มค่าการรอ", tags: ["อีสาน", "ส้มตำ"], menu: ["ส้มตำไทย", "ลาบหมู", "ไก่ย่าง"] },
    { id: "wattanapanich", name: "วัฒนาพานิช เนื้อตุ๋น", category: "food", area: "สุขุมวิท ซอย 55 (ทองหล่อ)", lat: 13.7256, lng: 100.5814, description: "ก๋วยเตี๋ยวเนื้อตุ๋นน้ำซุปข้นที่เคี่ยวต่อเนื่องมากว่า 50 ปี", tags: ["ก๋วยเตี๋ยวเนื้อ", "ร้านเก่าแก่"], menu: ["ก๋วยเตี๋ยวเนื้อตุ๋น", "เนื้อตุ๋นเปื่อย", "ลูกชิ้นเนื้อ"] },
    { id: "sukiteenoi", name: "สุกี้ตี๋น้อย สาขาเซ็นทรัลเวิลด์", category: "food", area: "เซ็นทรัลเวิลด์", lat: 13.7466, lng: 100.5393, description: "สุกี้บุฟเฟต์ราคาคุ้มค่า เปิดดึก มีทั้งน้ำจิ้มสูตรพิเศษและวัตถุดิบให้เลือกจุใจ", tags: ["สุกี้", "บุฟเฟต์"], menu: ["หมูสไลซ์", "เนื้อสไลซ์", "น้ำจิ้มสุกี้สูตรพิเศษ"] },
    { id: "boatnoodle", name: "ก๋วยเตี๋ยวเรือประตูน้ำ", category: "food", area: "ประตูน้ำ", lat: 13.7517, lng: 100.5397, description: "ก๋วยเตี๋ยวเรือรสจัดชามเล็กราคาย่อมเยา สั่งได้หลายชามไม่มีเบื่อ", tags: ["ก๋วยเตี๋ยวเรือ", "สตรีทฟู้ด"], menu: ["ก๋วยเตี๋ยวเรือหมู", "ก๋วยเตี๋ยวเรือเนื้อ", "ลูกชิ้นปลา"] },
    { id: "baankhunmae", name: "บ้านคุณแม่ สยามสแควร์", category: "food", area: "สยามสแควร์ ซอย 8", lat: 13.7458, lng: 100.5325, description: "อาหารไทยจานเดียวและกับข้าวรสชาติเป็นกันเอง เหมาะสำหรับมื้อกลางวัน", tags: ["อาหารไทย", "จานเดียว"], menu: ["ผัดกะเพรา", "ต้มยำกุ้ง", "แกงเขียวหวาน"] },
    { id: "mkrestaurant", name: "MK สุกี้ สาขาสยามพารากอน", category: "food", area: "สยามพารากอน", lat: 13.7460, lng: 100.5347, description: "สุกี้แบรนด์คนไทยที่คุ้นเคย บริการเร็ว เมนูครบ เหมาะกับมื้อครอบครัว", tags: ["สุกี้", "แบรนด์คนไทย"], menu: ["ชุดสุกี้รวมมิตร", "น้ำจิ้มสุกี้ MK", "ไข่ตุ๋น"] },
    { id: "nahm", name: "Nahm", category: "food", area: "สาทร", lat: 13.7223, lng: 100.5288, description: "อาหารไทยร่วมสมัยแนวไฟน์ไดนิ่ง ตีความสูตรโบราณให้ทันสมัย ติดมิชลิน", tags: ["ไฟน์ไดนิ่ง", "มิชลิน"], menu: ["แกงเผ็ดเป็ดย่าง", "ยำส้มโอ", "ข้าวผัดกุ้ง"] },
    { id: "greyhound", name: "Greyhound Café สาขาเอ็มควอเทียร์", category: "food", area: "เอ็มควอเทียร์", lat: 13.7300, lng: 100.5695, description: "ร้านอาหารไทยฟิวชันสไตล์อาร์ตี้ เมนูซิกเนเจอร์คือสปาเกตตีขี้เมาทะเล", tags: ["ฟิวชัน", "อาหารไทยประยุกต์"], menu: ["สปาเกตตีขี้เมาทะเล", "สลัดยำ", "ข้าวผัดปู"] },
    { id: "mkladprao", name: "MK สุกี้ สาขาเซ็นทรัลลาดพร้าว", category: "food", area: "เซ็นทรัลลาดพร้าว", lat: 13.8154, lng: 100.5613, description: "สุกี้แบรนด์คนไทยที่คุ้นเคย สาขาย่านลาดพร้าว-จตุจักร ใกล้รถไฟฟ้าหมอชิต", tags: ["สุกี้", "แบรนด์คนไทย"], menu: ["ชุดสุกี้รวมมิตร", "น้ำจิ้มสุกี้ MK"] },
    { id: "peaor", name: "Pe Aor Tom Yum Kung", category: "food", area: "ถนนสี่พระยา", lat: 13.7245, lng: 100.5310, description: "ต้มยำกุ้งซีฟู้ดสูตรเข้มข้น ร้านดังที่นักท่องเที่ยวต้องแวะ", tags: ["ต้มยำกุ้ง", "ซีฟู้ด"], menu: ["ต้มยำกุ้งน้ำข้น", "ปูผัดผงกะหรี่", "ยำทะเลรวม"] },
    { id: "err", name: "Err Urban Rustic Thai", category: "food", area: "ท่าเตียน", lat: 13.7460, lng: 100.4913, description: "อาหารไทยสไตล์ลูกทุ่งประยุกต์ บรรยากาศเก๋ใกล้แม่น้ำเจ้าพระยาและวัดโพธิ์", tags: ["อาหารไทย", "ริมแม่น้ำ"], menu: ["แกงคั่วหอยขม", "ยำปลาดุกฟู", "ข้าวคลุกกะปิ"] },
    // เครื่องดื่ม
    { id: "rocketcoffeebar", name: "Rocket Coffeebar", category: "drink", area: "เอกมัย ซอย 10", lat: 13.7195, lng: 100.5860, description: "ร้านกาแฟสเปเชียลตี้บรรยากาศดี เมล็ดกาแฟคุณภาพ เหมาะนั่งทำงานหรือนัดเพื่อน", tags: ["กาแฟ", "สเปเชียลตี้"], menu: ["ลาเต้ร้อน", "โคลด์บรูว์", "เอสเปรสโซ่"] },
    { id: "casalapin", name: "Casa Lapin สาขาเอกมัย", category: "drink", area: "เอกมัย ซอย 3", lat: 13.7215, lng: 100.5840, description: "คาเฟ่สไตล์มินิมอลชื่อดัง เมนูกาแฟและเลมอนซอร์เบ็ตเป็นซิกเนเจอร์", tags: ["คาเฟ่", "กาแฟ"], menu: ["เลมอนซอร์เบต์", "คาปูชิโน่", "ชาเขียวลาเต้"] },
    { id: "factorycoffee", name: "Factory Coffee", category: "drink", area: "เอกมัย", lat: 13.7188, lng: 100.5847, description: "โรงคั่วกาแฟและร้านกาแฟที่คอกาแฟตัวจริงต้องแวะ รสชาติกลมกล่อมคัดสรรพิเศษ", tags: ["กาแฟ", "โรงคั่ว"], menu: ["เอสเปรสโซ่โรงคั่ว", "ดริปกาแฟ", "โคลด์บรูว์"] },
    { id: "ceresia", name: "Ceresia Coffee Roasters", category: "drink", area: "สาทร ซอย 11", lat: 13.7205, lng: 100.5290, description: "ร้านกาแฟคั่วเอง บรรยากาศอบอุ่น เหมาะกับการนั่งจิบกาแฟช้าๆ", tags: ["กาแฟ", "โรงคั่ว"], menu: ["ลาเต้ร้อน", "ฟิลเตอร์คอฟฟี่", "โมคค่า"] },
    { id: "rootscoffee", name: "Roots Coffee Roaster", category: "drink", area: "ทองหล่อ ซอย 10", lat: 13.7295, lng: 100.5795, description: "หนึ่งในร้านกาแฟที่บุกเบิกวงการกาแฟสเปเชียลตี้ในกรุงเทพฯ", tags: ["กาแฟ", "สเปเชียลตี้"], menu: ["ลาเต้เย็น", "เอสเปรสโซ่", "ชาไทยลาเต้"] },
    { id: "chatramue", name: "ชาตรามือ สาขาเยาวราช", category: "drink", area: "เยาวราช", lat: 13.7398, lng: 100.5085, description: "ชาไทยแบรนด์ต้นตำรับ รสเข้มข้นหอมมัน เมนูคลาสสิกที่ทุกคนรู้จัก", tags: ["ชาไทย", "แบรนด์ไทย"], menu: ["ชาไทยเย็น", "ชาเขียวนมสด", "โกโก้เย็น"] },
    { id: "ichinihontea", name: "Ichi Nihon Tea สาขาสยามสแควร์วัน", category: "drink", area: "สยามสแควร์วัน", lat: 13.7457, lng: 100.5347, description: "ชาเขียวมัทฉะและชาญี่ปุ่นแท้ต้นตำรับ เมนูยอดฮิตคือลาเต้มัทฉะ", tags: ["ชาเขียว", "มัทฉะ"], menu: ["ลาเต้มัทฉะ", "มัทฉะเย็น", "โฮจิฉะลาเต้"] },
    { id: "bluecup", name: "Bluecup Coffee สาขาอารีย์", category: "drink", area: "อารีย์", lat: 13.7797, lng: 100.5448, description: "ร้านกาแฟสายเขียวรักษ์โลก เมนูเครื่องดื่มหลากหลายราคาจับต้องได้", tags: ["กาแฟ", "ราคาคุ้มค่า"], menu: ["อเมริกาโน่", "ลาเต้เย็น", "ชาผลไม้"] },
    { id: "koithe", name: "KOI Thé สาขาสยามสแควร์วัน", category: "drink", area: "สยามสแควร์วัน", lat: 13.7455, lng: 100.5345, description: "ชานมไข่มุกและชาผลไม้สไตล์ไต้หวัน เมนูฮิตคือชานมไข่มุกทองคำ", tags: ["ชานมไข่มุก", "ไต้หวัน"], menu: ["ชานมไข่มุกทองคำ", "ชาผลไม้", "ชาเขียวไข่มุก"] },
    { id: "mistercoconut", name: "Mister Coconut สาขาสยามสแควร์", category: "drink", area: "สยามสแควร์", lat: 13.7460, lng: 100.5335, description: "น้ำมะพร้าวสดและเครื่องดื่มจากมะพร้าวคลายร้อนสไตล์ไทย", tags: ["น้ำมะพร้าว", "เครื่องดื่มสดชื่น"], menu: ["น้ำมะพร้าวปั่น", "น้ำมะพร้าวสด", "ไอศกรีมมะพร้าว"] },
    { id: "bearhouse", name: "Bearhouse สาขาสยามสแควร์", category: "drink", area: "สยามสแควร์", lat: 13.7458, lng: 100.5338, description: "คาเฟ่หมีสุดฮิต ฮันนี่โทสต์คู่ไอศกรีมซอฟต์เสิร์ฟรสธรรมชาติ เมนูซิกเนเจอร์คือหมีบราวน์", tags: ["ฮันนี่โทสต์", "ไอศกรีม", "คาเฟ่หมี"], menu: ["หมีบราวน์ฮันนี่โทสต์", "ลาเต้ร้อน", "ช็อกโกแลตปั่น"] },
    { id: "roast", name: "Roast สาขาเอ็มควอเทียร์", category: "drink", area: "เอ็มควอเทียร์", lat: 13.7300, lng: 100.5698, description: "คาเฟ่และร้านอาหารเช้าชื่อดัง เมนูกาแฟและเบเกอรีครบครัน บรรยากาศดีย่านพร้อมพงษ์", tags: ["คาเฟ่", "เบเกอรี"], menu: ["เอสเปรสโซ่", "ลาเต้ร้อน", "สมูทตี้ผลไม้"] },
    { id: "arabica", name: "% Arabica สาขาไอคอนสยาม", category: "drink", area: "ไอคอนสยาม", lat: 13.7267, lng: 100.5099, description: "ร้านกาแฟญี่ปุ่นชื่อดังระดับโลก วิวริมแม่น้ำเจ้าพระยา", tags: ["กาแฟ", "วิวแม่น้ำ"], menu: ["ลาเต้ร้อน", "เอสเปรสโซ่", "ลาเต้เย็น"] },
    { id: "kolour", name: "Kolour by Kolour Coffee Project", category: "drink", area: "อารีย์", lat: 13.7793, lng: 100.5452, description: "คาเฟ่กาแฟสายสีสันสดใส ตกแต่งสวยงามเหมาะถ่ายรูป ย่านอารีย์", tags: ["กาแฟ", "คาเฟ่สวย"], menu: ["ลาเต้สายรุ้ง", "อเมริกาโน่", "ชาผลไม้เย็น"] },
    // ของหวาน
    { id: "afteryou", name: "After You สาขาเซ็นทรัลเวิลด์", category: "dessert", area: "เซ็นทรัลเวิลด์", lat: 13.7466, lng: 100.5393, description: "ต้นตำรับชิบูย่าโทสต์และฮันนี่โทสต์สุดฟิน เมนูขนมหวานยอดนิยมของคนกรุงเทพฯ", tags: ["ฮันนี่โทสต์", "คาเฟ่ขนมหวาน"], menu: ["ชิบูย่าฮันนี่โทสต์", "บราวนี่ซันเดย์", "มิลค์เชค"] },
    { id: "montnomsod", name: "มนต์นมสด (Mont Nom Sod)", category: "dessert", area: "บางลำพู", lat: 13.7596, lng: 100.4967, description: "ขนมปังปิ้งนมสดต้นตำรับที่เปิดมานาน เมนูซิกเนเจอร์คือขนมปังปิ้งหน้าสังขยา", tags: ["ขนมปังปิ้ง", "ร้านเก่าแก่"], menu: ["ขนมปังปิ้งหน้าสังขยา", "ขนมปังปิ้งนมข้น", "นมสดร้อน"] },
    { id: "korpanich", name: "ข้าวเหนียวมูนกรอบเนียน ก่อพานิช", category: "dessert", area: "ถนนตะนาว", lat: 13.7524, lng: 100.4970, description: "ข้าวเหนียวมะม่วงและข้าวเหนียวมูนต้นตำรับที่คนต่อคิวซื้อกลับบ้านทุกวัน", tags: ["ข้าวเหนียวมะม่วง", "ร้านเก่าแก่"], menu: ["ข้าวเหนียวมะม่วง", "ข้าวเหนียวมูนกรอบเนียน", "ข้าวเหนียวสังขยา"] },
    { id: "iberry", name: "iberry Garden", category: "dessert", area: "อ่อนนุช", lat: 13.7050, lng: 100.6030, description: "คาเฟ่ไอศกรีมโฮมเมดท่ามกลางสวนสีเขียว บรรยากาศร่มรื่นเหมาะพักผ่อน", tags: ["ไอศกรีม", "คาเฟ่สวน"], menu: ["ไอศกรีมโฮมเมด", "วาฟเฟิลไอศกรีม", "มิลค์เชค"] },
    { id: "kadkokoa", name: "Kad Kokoa", category: "dessert", area: "เอกมัย ซอย 12", lat: 13.7183, lng: 100.5865, description: "ร้านช็อกโกแลตและขนมหวานโฮมเมด เมนูเด็ดคือฮ็อตช็อกโกแลตข้นเข้ม", tags: ["ช็อกโกแลต", "คาเฟ่"], menu: ["ฮ็อตช็อกโกแลต", "บราวนี่", "ช็อกโกแลตทรัฟเฟิล"] },
    { id: "cheevitcheeva", name: "Cheevit Cheeva", category: "dessert", area: "เอกมัย", lat: 13.7180, lng: 100.5830, description: "คาเฟ่ขนมหวานสไตล์มินิมอล เมนูซิกเนเจอร์คือเค้กและขนมโฮมเมดหน้าตาน่ารัก", tags: ["เค้ก", "คาเฟ่มินิมอล"], menu: ["เค้กหน้านิ่ม", "ทาร์ตผลไม้", "ลาเต้ร้อน"] },
    { id: "erawantearoom", name: "Erawan Tea Room", category: "dessert", area: "ราชประสงค์", lat: 13.7440, lng: 100.5405, description: "ข้าวเหนียวมะม่วงและขนมไทยประยุกต์ในบรรยากาศหรูใจกลางเมือง", tags: ["ข้าวเหนียวมะม่วง", "ขนมไทย"], menu: ["ข้าวเหนียวมะม่วง", "ขนมไทยรวม", "ชาไทยเย็น"] },
    { id: "bualoynana", name: "บัวลอยเยาวราช", category: "dessert", area: "เยาวราช", lat: 13.7401, lng: 100.5093, description: "บัวลอยไข่หวานร้อนๆ สูตรดั้งเดิมย่านไชน่าทาวน์ ของหวานเรียกความทรงจำวัยเด็ก", tags: ["บัวลอย", "ไชน่าทาวน์"], menu: ["บัวลอยไข่หวาน", "บัวลอยเผือก", "น้ำขิงร้อน"] },
    { id: "douhua", name: "เต้าฮวยเจ้าเก่า เยาวราช", category: "dessert", area: "เยาวราช", lat: 13.7396, lng: 100.5087, description: "เต้าฮวยนุ่มละมุนราดน้ำขิงหอมกรุ่น ของหวานต้นตำรับย่านเยาวราช", tags: ["เต้าฮวย", "ไชน่าทาวน์"], menu: ["เต้าฮวยน้ำขิง", "เต้าฮวยนมสด", "ปาท่องโก๋"] },
    { id: "gussdamngood", name: "Guss Damn Good สาขาอารีย์", category: "dessert", area: "อารีย์", lat: 13.7788, lng: 100.5440, description: "ไอศกรีมโฮมเมดรสชาติแปลกใหม่ เปลี่ยนเมนูตามฤดูกาล ร้านดังย่านอารีย์", tags: ["ไอศกรีม", "โฮมเมด"], menu: ["ไอศกรีมรสประจำเดือน", "ไอศกรีมช็อกโกแลต", "ไอศกรีมผลไม้"] },
    { id: "afteryouladprao", name: "After You สาขาเซ็นทรัลลาดพร้าว", category: "dessert", area: "เซ็นทรัลลาดพร้าว", lat: 13.8154, lng: 100.5613, description: "ต้นตำรับชิบูย่าโทสต์และฮันนี่โทสต์ สาขาย่านลาดพร้าว-จตุจักร ใกล้รถไฟฟ้าหมอชิต", tags: ["ฮันนี่โทสต์", "คาเฟ่ขนมหวาน"], menu: ["ชิบูย่าฮันนี่โทสต์", "บราวนี่ซันเดย์"] },
  ];

  // ---------- โหมด "สุ่มเมนู" — แตกเมนูของทุกร้านออกมาเป็นรายการแบนๆ ----------
  // แต่ละชิ้นมีหน้าตาเหมือนร้าน (category/lat/lng) เพื่อให้ categoryPool()/withinRadius()/pool()
  // เดิมใช้ซ้ำได้ทั้งสองโหมดโดยไม่ต้องแยกโค้ด ส่วน .restaurant เก็บร้านต้นทางไว้ไปโชว์ตอน render
  var MENU_ITEMS = [];
  RESTAURANTS.forEach(function (r) {
    (r.menu || []).forEach(function (item, idx) {
      MENU_ITEMS.push({
        id: r.id + "-menu-" + idx,
        name: item,
        category: r.category,
        area: r.area,
        lat: r.lat,
        lng: r.lng,
        restaurant: r,
      });
    });
  });

  // ---------- โซน/ห้างยอดฮิต — เลือกแทนการขอตำแหน่ง GPS ก็ได้ ----------
  var ZONES = [
    { id: "siam", name: "สยาม", lat: 13.7458, lng: 100.5340 },
    { id: "centralworld", name: "เซ็นทรัลเวิลด์", lat: 13.7466, lng: 100.5393 },
    { id: "ekkamai", name: "ทองหล่อ-เอกมัย", lat: 13.7250, lng: 100.5820 },
    { id: "emquartier", name: "เอ็มควอเทียร์", lat: 13.7300, lng: 100.5695 },
    { id: "iconsiam", name: "ไอคอนสยาม", lat: 13.7267, lng: 100.5099 },
    { id: "yaowarat", name: "เยาวราช", lat: 13.7398, lng: 100.5088 },
    { id: "ari", name: "อารีย์", lat: 13.7793, lng: 100.5448 },
    { id: "sathorn", name: "สาทร", lat: 13.7215, lng: 100.5295 },
    { id: "ladprao", name: "ลาดพร้าว-จตุจักร", lat: 13.8154, lng: 100.5613 },
  ];

  /**
   * ลิงก์ Google Maps ไปยังร้านนี้โดยตรง — คลิกแล้วเจอร้านจริงเสมอ (ไม่ต้องล็อกอิน)
   * ส่วนใหญ่ร้านดังจะมีปุ่ม "สั่งอาหาร" ต่อไปยัง LINE MAN/Grab/ShopeeFood ให้ในหน้า Maps เลย ถ้าร้านนั้นเปิดให้บริการ
   *
   * ร้านจาก OSM มีพิกัดจริงติดมาด้วย (มาจาก OpenStreetMap ตรงๆ) จึงใช้พิกัดเปิด Maps ตรงจุดได้เป๊ะ
   * ส่วนร้านคัดสรรของเราใช้ชื่อ+ย่านค้นหาแทน เพราะพิกัดที่ตั้งไว้เป็นค่าประมาณของย่าน ไม่ใช่หน้าร้านเป๊ะๆ
   */
  function getMapsLink(result) {
    if (result.isOsm) {
      return "https://www.google.com/maps/search/?api=1&query=" + result.lat + "," + result.lng;
    }
    var q = encodeURIComponent(result.name + " " + result.area + " กรุงเทพ");
    return "https://www.google.com/maps/search/?api=1&query=" + q;
  }

  /**
   * ลิงก์ไปหน้าค้นหาร้านนี้บน Wongnai — สำหรับอ่านรีวิว/ดูเมนู/ราคาก่อนตัดสินใจ
   * ถ้าระบุ menuName มาด้วย (โหมดสุ่มเมนู) จะค้นด้วยชื่อร้าน+ชื่อเมนู แทนชื่อร้าน+ย่าน เพื่อพาไปหน้าที่เกี่ยวกับเมนูนั้นตรงๆ มากขึ้น
   */
  function getWongnaiLink(result, menuName) {
    var q;
    if (result.isOsm) {
      q = result.name;
    } else if (menuName) {
      q = result.name + " " + menuName;
    } else {
      q = result.name + " " + result.area;
    }
    return "https://www.wongnai.com/search?q=" + encodeURIComponent(q);
  }

  /**
   * ลิงก์เปิดแอป/เว็บของแต่ละแพลตฟอร์ม — เป็นหน้าแรกจริงของแต่ละเจ้า (ไม่ใช่ผลค้นหาปลอม)
   * เพราะ LINE MAN / Grab / ShopeeFood ไม่มี URL ค้นหาสาธารณะที่พาไปหน้าร้านตรงๆ ได้
   * ผู้ใช้เปิดแล้วพิมพ์ชื่อร้านค้นหาต่อในแอปได้เลย
   */
  function getAppLinks() {
    return [
      { id: "lineman", label: "LINE MAN", color: "#00B900", url: "https://food.lineman.line.me/" },
      { id: "grab", label: "Grab", color: "#00B14F", url: "https://food.grab.com/th/en/" },
      { id: "shopeefood", label: "ShopeeFood", color: "#EE4D2D", url: "https://shopeefood.co.th/" },
    ];
  }

  function catMeta(id) {
    for (var i = 0; i < CATEGORIES.length; i++) {
      if (CATEGORIES[i].id === id) return CATEGORIES[i];
    }
    return null;
  }

  /** ระยะทางแบบเส้นตรง (กม.) ระหว่างสองพิกัด — สูตร Haversine */
  function distanceKm(lat1, lng1, lat2, lng2) {
    var R = 6371;
    var dLat = ((lat2 - lat1) * Math.PI) / 180;
    var dLng = ((lng2 - lng1) * Math.PI) / 180;
    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  var RADIUS_OPTIONS = [1, 3, 5, 10, 20]; // กม. — ตัวเลือกที่ผู้ใช้กำหนดเองได้

  /**
   * ค้นหาร้านใกล้ตัวแบบ "สด" จาก OpenStreetMap (Overpass API) — ฟรี ไม่ต้องมี API key
   * ใช้เมื่อร้านในรายการคัดสรรของเรามีในระยะที่เลือกน้อยเกินไป (เช่นอยู่นอกโซนที่เก็บข้อมูลไว้)
   * เพื่อให้ "ใกล้ฉัน" ใช้ได้จริงไม่ว่าจะอยู่ที่ไหนในกรุงเทพฯ พิกัดที่ได้มาจาก OSM ตรงๆ
   * จึงเอาไปเปิด Google Maps ได้ตรงตำแหน่งจริงเสมอ (ไม่ใช่การเดาที่อยู่เหมือนก่อนหน้านี้)
   */
  var OSM_ENDPOINT = "https://overpass-api.de/api/interpreter";
  var OSM_QUERY_MIN_CURATED = 3; // ถ้าร้านคัดสรรในระยะมีน้อยกว่านี้ ค่อยไปถาม OSM เพิ่ม
  var OSM_TAG_QUERY = {
    food: '["amenity"~"^(restaurant|fast_food|food_court)$"]',
    drink: '["amenity"~"^(cafe|bar|pub)$"]',
    dessert: '["amenity"~"^(ice_cream|cafe)$"]',
    all: '["amenity"~"^(restaurant|fast_food|food_court|cafe|bar|pub|ice_cream)$"]',
  };

  function osmAmenityToCategory(tags) {
    var a = (tags && tags.amenity) || "";
    if (a === "cafe" || a === "bar" || a === "pub") return "drink";
    if (a === "ice_cream") return "dessert";
    return "food";
  }

  function osmKeyFor(lat, lng, radiusKm, filter) {
    return lat.toFixed(3) + "," + lng.toFixed(3) + "|" + radiusKm + "|" + filter;
  }

  /** ยิง query ไปหา Overpass API แล้วแปลงผลลัพธ์ให้อยู่ในรูปแบบเดียวกับร้านในรายการคัดสรร */
  function fetchOsmNearby(lat, lng, radiusKm, filter, done) {
    var tagQuery = OSM_TAG_QUERY[filter] || OSM_TAG_QUERY.all;
    var radiusM = Math.round(Math.min(radiusKm, 20) * 1000);
    var q = "[out:json][timeout:15];node" + tagQuery + "(around:" + radiusM + "," + lat + "," + lng + ");out body 40;";

    fetch(OSM_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: "data=" + encodeURIComponent(q),
    })
      .then(function (res) {
        if (!res.ok) throw new Error("HTTP " + res.status);
        return res.json();
      })
      .then(function (json) {
        var seenNames = {};
        var list = [];
        (json.elements || []).forEach(function (el) {
          if (!el.tags || !el.tags.name) return;
          if (seenNames[el.tags.name]) return;
          seenNames[el.tags.name] = true;
          var cat = filter === "all" ? osmAmenityToCategory(el.tags) : filter;
          var cuisine = el.tags.cuisine ? el.tags.cuisine.split(";").slice(0, 2) : [];
          list.push({
            id: "osm-" + el.id,
            name: el.tags.name,
            category: cat,
            area: el.tags["addr:street"] || el.tags["addr:suburb"] || el.tags["addr:district"] || "ใกล้ตำแหน่งนี้",
            lat: el.lat,
            lng: el.lon,
            description: "ร้านจากฐานข้อมูลชุมชน OpenStreetMap ใกล้ตำแหน่งที่เลือก" + (cuisine.length ? " · เมนู: " + cuisine.join(", ") : ""),
            tags: cuisine,
            isOsm: true,
          });
        });
        done(list, null);
      })
      .catch(function (err) {
        done([], err);
      });
  }

  var state = {
    mode: "restaurant", // "restaurant" = สุ่มร้านแล้วโชว์เมนู | "menu" = สุ่มเมนูก่อนแล้วโชว์ร้านที่มีขาย
    filter: "all",
    result: null,
    spinning: false,
    timer: null,
    nearMe: false, // true = จำกัดการสุ่มให้เฉพาะร้านใกล้ตัว
    userLoc: null, // { lat, lng }
    locating: false,
    radiusKm: 5, // ระยะที่ผู้ใช้กำหนดเอง
    locationLabel: "", // ข้อความบอกว่ากำลังอิงตำแหน่งไหนอยู่ (GPS หรือชื่อโซน)
    activeZoneId: null, // id ของโซนที่เลือกอยู่ (null = ใช้ GPS)
    osm: { key: "", status: "idle", data: [], pending: [] }, // status: idle | loading | done | error
    selectedMenu: null, // เมนูที่ผู้ใช้เลือกไว้สำหรับร้านที่สุ่มได้ (รีเซ็ตทุกครั้งที่สุ่มใหม่)
  };

  var els = {
    modeTabs: document.getElementById("modeTabs"),
    filters: document.getElementById("filterButtons"),
    nearMeBtn: document.getElementById("nearMeBtn"),
    locationStatus: document.getElementById("locationStatus"),
    radiusRow: document.getElementById("radiusRow"),
    radiusButtons: document.getElementById("radiusButtons"),
    radiusCount: document.getElementById("radiusCount"),
    spinBtn: document.getElementById("spinBtn"),
    spinLabel: document.getElementById("spinLabel"),
    empty: document.getElementById("emptyState"),
    card: document.getElementById("resultCard"),
    catBadge: document.getElementById("catBadge"),
    headline: document.getElementById("resultHeadline"),
    subline: document.getElementById("resultSubline"),
    area: document.getElementById("resultArea"),
    distance: document.getElementById("resultDistance"),
    source: document.getElementById("resultSource"),
    desc: document.getElementById("resultDesc"),
    tags: document.getElementById("resultTags"),
    menuSection: document.getElementById("menuSection"),
    menuChips: document.getElementById("menuChips"),
    menuNote: document.getElementById("menuNote"),
    mapsLink: document.getElementById("mapsLink"),
    wongnaiLink: document.getElementById("wongnaiLink"),
    appLinks: document.getElementById("appLinks"),
    zoneButtons: document.getElementById("zoneButtons"),
    locationSource: document.getElementById("locationSource"),
  };

  function categoryPool() {
    var base = state.mode === "menu" ? MENU_ITEMS : RESTAURANTS;
    if (state.filter === "all") return base;
    return base.filter(function (r) { return r.category === state.filter; });
  }

  /**
   * รายชื่อร้านให้สุ่ม — ถ้าเปิด "ใกล้ฉัน" จะจำกัดเฉพาะร้านที่อยู่ในระยะที่ผู้ใช้กำหนด (state.radiusKm)
   * ถ้าไม่มีร้านเลยในระยะนั้น จะ fallback ไปหาร้านที่ใกล้ที่สุดเท่าที่มีแทน (กันสุ่มไม่ออก)
   */
  function withinRadius() {
    var base = categoryPool();
    var withDist = base.map(function (r) {
      return { r: r, km: distanceKm(state.userLoc.lat, state.userLoc.lng, r.lat, r.lng) };
    });
    withDist.sort(function (a, b) { return a.km - b.km; });
    var within = withDist.filter(function (x) { return x.km <= state.radiusKm; });
    return { within: within, nearest: withDist };
  }

  /** ผลลัพธ์ OSM ที่ cache ไว้ — ใช้ได้ก็ต่อเมื่อ key ตรงกับตัวกรอง/ตำแหน่ง/ระยะปัจจุบันเป๊ะๆ */
  function getOsmDataForCurrentContext() {
    if (!state.userLoc) return [];
    var key = osmKeyFor(state.userLoc.lat, state.userLoc.lng, state.radiusKm, state.filter);
    if (state.osm.key === key && state.osm.status === "done") return state.osm.data;
    return [];
  }

  function pool() {
    var base = categoryPool();
    if (!state.nearMe || !state.userLoc) return base;

    var result = withinRadius();
    var curated = result.within.map(function (x) { return x.r; });
    // โหมดสุ่มเมนู: OSM ไม่มีข้อมูลเมนูติดมาด้วย เลยไม่ผสมร้านจาก OSM เข้ามาในโหมดนี้
    var osm = state.mode === "menu" ? [] : getOsmDataForCurrentContext();
    var combined = curated.concat(osm);
    if (combined.length > 0) return combined;

    // ไม่มีร้าน/เมนูเลยแม้จะลองถาม OSM แล้ว — fallback ไปเอา 5 รายการที่ใกล้ที่สุดแทน
    // เพื่อให้ "สุ่มใหม่" ยังสุ่มได้จริง ไม่ใช่ได้อันเดิมซ้ำทุกครั้ง
    return result.nearest.slice(0, 5).map(function (x) { return x.r; });
  }

  /**
   * เรียกก่อนสุ่ม/แสดงผลทุกครั้งที่ตำแหน่ง/ระยะ/หมวดหมู่เปลี่ยน — ถ้าร้านคัดสรรในระยะมีพอแล้วจะ
   * เรียก cb() ทันที (ไม่ยิง network), ถ้าน้อยเกินไปจะไปถาม OSM เพิ่ม (แคชผลไว้กันยิงซ้ำ)
   * โหมดสุ่มเมนูไม่ใช้ OSM เลย (ไม่มีข้อมูลเมนูให้ผูกกับร้านจาก OSM ได้) จึงข้ามไปเรียก cb() ทันที
   */
  function ensureNearbyData(cb) {
    if (state.mode === "menu") { cb(); return; }
    if (!state.nearMe || !state.userLoc) { cb(); return; }
    if (withinRadius().within.length >= OSM_QUERY_MIN_CURATED) { cb(); return; }

    var key = osmKeyFor(state.userLoc.lat, state.userLoc.lng, state.radiusKm, state.filter);

    if (state.osm.key === key) {
      if (state.osm.status === "done" || state.osm.status === "error") { cb(); return; }
      if (state.osm.status === "loading") { state.osm.pending.push(cb); return; }
    }

    state.osm.key = key;
    state.osm.status = "loading";
    state.osm.pending = [];
    updateRadiusCount();
    setSpinLoadingUI(true);

    fetchOsmNearby(state.userLoc.lat, state.userLoc.lng, state.radiusKm, state.filter, function (list, err) {
      var isCurrent = state.osm.key === key;
      if (isCurrent) {
        state.osm.status = err ? "error" : "done";
        state.osm.data = list;
        updateRadiusCount();
      }
      setSpinLoadingUI(false);
      cb();
      if (isCurrent) {
        var pending = state.osm.pending;
        state.osm.pending = [];
        pending.forEach(function (fn) { fn(); });
      }
    });
  }

  /** ข้อความปุ่มสุ่มตอนว่าง — ขึ้นกับโหมดปัจจุบันและว่ามีผลลัพธ์อยู่แล้วหรือยัง */
  function spinIdleLabel() {
    if (state.mode === "menu") return state.result ? "สุ่มเมนูใหม่" : "สุ่มเมนูเลย";
    return state.result ? "สุ่มใหม่" : "สุ่มร้านเลย";
  }

  function setSpinLoadingUI(isLoading) {
    if (isLoading) {
      els.spinBtn.disabled = true;
      els.spinLabel.textContent = state.mode === "menu" ? "🔎 กำลังหาเมนูใกล้ๆ..." : "🔎 กำลังหาร้านใกล้ๆ...";
    } else if (!state.spinning) {
      els.spinBtn.disabled = false;
      els.spinLabel.textContent = spinIdleLabel();
    }
  }

  function pickRandom(excludeId) {
    var options = pool();
    if (excludeId && options.length > 1) {
      options = options.filter(function (r) { return r.id !== excludeId; });
    }
    return options[Math.floor(Math.random() * options.length)];
  }

  /**
   * เมนูแนะนำของร้านที่สุ่มได้ — ให้กดเลือกได้ว่าจะสั่งอันไหน (ร้านจาก OSM ไม่มีข้อมูลเมนู เลยโชว์โน้ตแทน)
   * ใช้เฉพาะโหมด "สุ่มร้าน" — โหมด "สุ่มเมนู" เลือกเมนูให้แล้วตั้งแต่ตอนสุ่ม เลยไม่ต้องมีตัวเลือกซ้ำ
   */
  function renderMenu() {
    var menu = state.result.menu;
    if (!menu || menu.length === 0) {
      els.menuChips.innerHTML = "";
      els.menuChips.hidden = true;
      els.menuNote.hidden = false;
      return;
    }
    els.menuNote.hidden = true;
    els.menuChips.hidden = false;
    els.menuChips.innerHTML = "";
    menu.forEach(function (item) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "menu-chip" + (state.selectedMenu === item ? " is-selected" : "");
      btn.textContent = item;
      btn.addEventListener("click", function () {
        state.selectedMenu = state.selectedMenu === item ? null : item;
        renderMenu();
      });
      els.menuChips.appendChild(btn);
    });
  }

  function render(isSpinning) {
    if (!state.result) {
      els.empty.hidden = false;
      els.card.hidden = true;
      return;
    }
    els.empty.hidden = true;
    els.card.hidden = false;
    els.card.style.opacity = isSpinning ? "0.6" : "1";

    var isMenuMode = state.mode === "menu";
    // โหมดสุ่มเมนู: state.result คือ "เมนู" (มี .restaurant ผูกกับร้านต้นทาง) — เอาชื่อร้าน/ย่าน/
    // คำอธิบาย/แท็ก/ลิงก์มาจากร้านนั้นแทน ส่วนโหมดสุ่มร้าน state.result คือร้านเลย
    var restaurant = isMenuMode ? state.result.restaurant : state.result;

    var meta = catMeta(state.result.category);
    els.catBadge.textContent = meta ? meta.emoji + " " + meta.label : "";

    if (isMenuMode) {
      els.headline.textContent = "🍽️ " + state.result.name;
      els.subline.hidden = false;
      els.subline.textContent = "จากร้าน: " + restaurant.name;
    } else {
      els.headline.textContent = state.result.name;
      els.subline.hidden = true;
    }

    els.area.textContent = restaurant.area;
    els.desc.textContent = restaurant.description;

    if (state.nearMe && state.userLoc) {
      var km = distanceKm(state.userLoc.lat, state.userLoc.lng, state.result.lat, state.result.lng);
      els.distance.hidden = false;
      var outOfRange = km > state.radiusKm;
      els.distance.textContent = "· ห่างประมาณ " + km.toFixed(1) + " กม. (เส้นตรง)" + (outOfRange ? " — นอกระยะที่เลือก" : "");
      els.distance.classList.toggle("out-of-range", outOfRange);
    } else {
      els.distance.hidden = true;
      els.distance.classList.remove("out-of-range");
    }

    if (state.result.isOsm) {
      els.source.hidden = false;
      els.source.textContent = "· 📡 จาก OpenStreetMap";
    } else {
      els.source.hidden = true;
    }

    els.tags.innerHTML = "";
    restaurant.tags.forEach(function (tag) {
      var span = document.createElement("span");
      span.className = "tag";
      span.textContent = "#" + tag;
      els.tags.appendChild(span);
    });

    // โหมดสุ่มเมนู: เมนูถูกสุ่มมาให้แล้วตั้งแต่ต้น เลยไม่ต้องมีชิปให้เลือกซ้ำอีกที
    els.menuSection.hidden = isMenuMode;
    if (!isMenuMode) renderMenu();

    els.mapsLink.href = getMapsLink(restaurant);
    els.wongnaiLink.href = getWongnaiLink(restaurant, isMenuMode ? state.result.name : null);

    els.appLinks.innerHTML = "";
    getAppLinks().forEach(function (link) {
      var a = document.createElement("a");
      a.href = link.url;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.className = "app-btn";
      a.style.backgroundColor = link.color;
      a.textContent = link.label;
      els.appLinks.appendChild(a);
    });
  }

  function setFilterUI() {
    var buttons = els.filters.querySelectorAll("button");
    buttons.forEach(function (btn) {
      btn.classList.toggle("active", btn.dataset.filter === state.filter);
    });
  }

  function setLocationStatus(text) {
    els.locationStatus.textContent = text || "";
    els.locationStatus.hidden = !text;
  }

  function setNearMeUI() {
    els.nearMeBtn.classList.toggle("active", state.nearMe);
    els.nearMeBtn.classList.toggle("is-locating", state.locating);
    els.radiusRow.hidden = !state.nearMe;
    if (state.nearMe && state.locationLabel) {
      els.locationSource.hidden = false;
      els.locationSource.textContent = "📍 อิงตำแหน่ง: " + state.locationLabel;
    } else {
      els.locationSource.hidden = true;
    }
    setZoneUI();
    updateRadiusCount();
  }

  function setZoneUI() {
    var buttons = els.zoneButtons.querySelectorAll("button");
    buttons.forEach(function (btn) {
      btn.classList.toggle("active", state.nearMe && btn.dataset.zone === state.activeZoneId);
    });
  }

  function setRadiusUI() {
    var buttons = els.radiusButtons.querySelectorAll("button");
    buttons.forEach(function (btn) {
      btn.classList.toggle("active", Number(btn.dataset.radius) === state.radiusKm);
    });
  }

  function updateRadiusCount() {
    if (!state.nearMe || !state.userLoc) {
      els.radiusCount.hidden = true;
      return;
    }
    var result = withinRadius();
    var curatedCount = result.within.length;
    els.radiusCount.hidden = false;
    els.radiusCount.classList.remove("warn");

    // โหมดสุ่มเมนูไม่ใช้ OSM เลย เลยมีแค่สองสถานะ: เจอ/ไม่เจอในระยะที่เลือก
    if (state.mode === "menu") {
      if (curatedCount > 0) {
        els.radiusCount.textContent = "พบ " + curatedCount + " เมนูในระยะ " + state.radiusKm + " กม.";
        return;
      }
      var nearestMenuKm = result.nearest.length > 0 ? result.nearest[0].km.toFixed(1) : "?";
      els.radiusCount.textContent =
        "⚠️ ไม่มีเมนูในระยะ " + state.radiusKm + " กม. — เมนูที่ใกล้ที่สุดอยู่ห่าง " + nearestMenuKm + " กม. (จะสุ่มจาก 5 เมนูที่ใกล้ที่สุดแทน)";
      els.radiusCount.classList.add("warn");
      return;
    }

    if (curatedCount >= OSM_QUERY_MIN_CURATED) {
      els.radiusCount.textContent = "พบ " + curatedCount + " ร้านในระยะ " + state.radiusKm + " กม.";
      return;
    }

    if (state.osm.status === "loading") {
      els.radiusCount.textContent = "🔎 ร้านคัดสรรมีน้อยแถวนี้ กำลังหาร้านใกล้ๆ เพิ่มจาก OpenStreetMap...";
      return;
    }

    var osmList = getOsmDataForCurrentContext();
    var total = curatedCount + osmList.length;
    if (total > 0) {
      els.radiusCount.textContent =
        "พบ " + total + " ร้านในระยะ " + state.radiusKm + " กม." +
        (osmList.length > 0 ? " (" + curatedCount + " จากรายการคัดสรร + " + osmList.length + " จาก OpenStreetMap)" : "");
      return;
    }

    var nearestKm = result.nearest.length > 0 ? result.nearest[0].km.toFixed(1) : "?";
    var osmNote = state.osm.status === "error" ? " (ค้นหาร้านเพิ่มจาก OpenStreetMap ไม่สำเร็จ)" : "";
    els.radiusCount.textContent =
      "⚠️ ไม่มีร้านในระยะ " + state.radiusKm + " กม." + osmNote + " — ร้านคัดสรรที่ใกล้ที่สุดอยู่ห่าง " + nearestKm + " กม. (จะสุ่มจาก 5 ร้านที่ใกล้ที่สุดแทน)";
    els.radiusCount.classList.add("warn");
  }

  function requestLocation() {
    if (!("geolocation" in navigator)) {
      setLocationStatus("เบราว์เซอร์นี้ไม่รองรับการหาตำแหน่ง ลองเลือกทั้งหมดแทนนะ");
      state.nearMe = false;
      setNearMeUI();
      return;
    }
    state.locating = true;
    setNearMeUI();
    setLocationStatus("กำลังหาตำแหน่งของคุณ...");

    navigator.geolocation.getCurrentPosition(
      function (pos) {
        state.userLoc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        state.nearMe = true;
        state.locating = false;
        state.activeZoneId = null;
        state.locationLabel = "ตำแหน่งปัจจุบันของคุณ";
        setNearMeUI();
        setLocationStatus("");
        render(false);
        ensureNearbyData(function () {});
      },
      function (err) {
        state.locating = false;
        state.nearMe = false;
        setNearMeUI();
        var msg = "หาตำแหน่งไม่สำเร็จ ลองเลือกทั้งหมดแทนนะ";
        if (err && err.code === err.PERMISSION_DENIED) {
          msg = "ไม่ได้รับอนุญาตให้เข้าถึงตำแหน่ง — เปิดสิทธิ์ตำแหน่งของเบราว์เซอร์แล้วลองใหม่";
        }
        setLocationStatus(msg);
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 5 * 60 * 1000 }
    );
  }

  /** ข้อความในกล่องว่าง (ก่อนกดสุ่มครั้งแรก) — ขึ้นกับโหมดปัจจุบัน */
  function updateEmptyStateText() {
    els.empty.textContent =
      state.mode === "menu"
        ? "กดปุ่ม “สุ่มเมนูเลย” เพื่อสุ่มเมนูเด็ดของกรุงเทพฯ แล้วดูว่าร้านไหนมีขาย"
        : "กดปุ่ม “สุ่มร้านเลย” เพื่อเริ่มค้นหาร้านเด็ดของกรุงเทพฯ";
  }

  els.modeTabs.addEventListener("click", function (e) {
    var btn = e.target.closest("button[data-mode]");
    if (!btn || state.spinning) return;
    var mode = btn.dataset.mode;
    if (mode === state.mode) return;
    state.mode = mode;
    state.result = null;
    state.selectedMenu = null;
    els.modeTabs.querySelectorAll("button").forEach(function (b) {
      b.classList.toggle("active", b.dataset.mode === mode);
    });
    updateEmptyStateText();
    setSpinLoadingUI(false);
    updateRadiusCount();
    render(false);
    ensureNearbyData(function () {});
  });

  els.filters.addEventListener("click", function (e) {
    var btn = e.target.closest("button[data-filter]");
    if (!btn || state.spinning) return;
    state.filter = btn.dataset.filter;
    setFilterUI();
    updateRadiusCount();
    ensureNearbyData(function () {});
  });

  els.radiusButtons.addEventListener("click", function (e) {
    var btn = e.target.closest("button[data-radius]");
    if (!btn || state.spinning) return;
    state.radiusKm = Number(btn.dataset.radius);
    setRadiusUI();
    updateRadiusCount();
    ensureNearbyData(function () {});
  });

  els.nearMeBtn.addEventListener("click", function () {
    if (state.spinning || state.locating) return;
    if (state.nearMe) {
      // ปิดโหมดใกล้ฉัน กลับไปสุ่มจากทั้งหมด
      state.nearMe = false;
      setNearMeUI();
      setLocationStatus("");
      render(false);
      return;
    }
    if (state.userLoc) {
      state.nearMe = true;
      setNearMeUI();
      render(false);
      ensureNearbyData(function () {});
      return;
    }
    requestLocation();
  });

  els.zoneButtons.addEventListener("click", function (e) {
    var btn = e.target.closest("button[data-zone]");
    if (!btn || state.spinning || state.locating) return;
    var zone = ZONES.filter(function (z) { return z.id === btn.dataset.zone; })[0];
    if (!zone) return;
    state.userLoc = { lat: zone.lat, lng: zone.lng };
    state.nearMe = true;
    state.activeZoneId = zone.id;
    state.locationLabel = zone.name;
    setLocationStatus("");
    setNearMeUI();
    render(false);
    ensureNearbyData(function () {});
  });

  function runSpin() {
    state.spinning = true;
    state.selectedMenu = null;
    els.spinBtn.disabled = true;
    els.spinBtn.classList.add("spinning");
    els.spinLabel.textContent = "กำลังสุ่ม...";

    var ticks = 0;
    var totalTicks = 14;
    var prevId = state.result ? state.result.id : null;

    state.timer = setInterval(function () {
      ticks += 1;
      state.result = pickRandom();
      render(true);
      if (ticks >= totalTicks) {
        clearInterval(state.timer);
        state.result = pickRandom(prevId);
        render(false);
        state.spinning = false;
        els.spinBtn.disabled = false;
        els.spinBtn.classList.remove("spinning");
        els.spinLabel.textContent = spinIdleLabel();
      }
    }, 80);
  }

  els.spinBtn.addEventListener("click", function () {
    if (state.spinning) return;
    // ถ้าร้านคัดสรรแถวนี้มีน้อย จะรอถามร้านใกล้ๆ จาก OSM ก่อน (ปุ่มจะโชว์ "กำลังหาร้านใกล้ๆ...")
    // แล้วค่อยเริ่มสุ่มจากรายการที่ครบแล้ว
    ensureNearbyData(function () {
      if (pool().length === 0) return;
      runSpin();
    });
  });

  setFilterUI();
  setRadiusUI();
  setNearMeUI();
  updateEmptyStateText();
  render(false);
})();

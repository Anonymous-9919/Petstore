export type Locale = "en" | "ar";

export const translations: Record<string, { en: string; ar: string }> = {
  // Navigation
  "nav.home": { en: "Home", ar: "الرئيسية" },
  "nav.shop": { en: "Shop", ar: "المتجر" },
  "nav.cats": { en: "Cats", ar: "القطط" },
  "nav.dogs": { en: "Dogs", ar: "الكلاب" },
  "nav.birds": { en: "Birds", ar: "الطيور" },
  "nav.fish": { en: "Fish", ar: "الأسماك" },
  "nav.rabbits": { en: "Rabbits", ar: "الأرانب" },
  "nav.hamsters": { en: "Hamsters", ar: "الهامستر" },
  "nav.reptiles": { en: "Reptiles", ar: "الزواحف" },
  "nav.general": { en: "General", ar: "عام" },
  "nav.more": { en: "More", ar: "المزيد" },
  "nav.locations": { en: "Our Branches", ar: "فروعنا" },
  "nav.contact": { en: "Contact", ar: "اتصل بنا" },
  "nav.cart": { en: "Cart", ar: "السلة" },
  "nav.checkout": { en: "Checkout", ar: "الدفع" },
  "nav.back": { en: "Back", ar: "رجوع" },
  "nav.menu": { en: "Menu", ar: "القائمة" },

  // Hero
  "hero.badge": { en: "Kuwait's #1 Pet Store", ar: "أول متجر حيوانات في الكويت" },
  "hero.title1": { en: "Everything Your", ar: "كل ما يحتاجه" },
  "hero.title2": { en: "Pet Needs", ar: "حيوانك الأليف" },
  "hero.title3": { en: "And More", ar: "وأكثر" },
  "hero.subtitle": {
    en: "Premium pet food, toys, accessories & care products for cats, dogs, birds, fish & more. Fast delivery across Kuwait or pickup from our 3 branches.",
    ar: "أطعمة ومستلزمات حيوانات أليفة مميزة للقطط والكلاب والطيور والأسماك وأكثر. توصيل سريع لجميع أنحاء الكويت أو استلام من فروعنا الثلاثة.",
  },
  "hero.cta-shop": { en: "Shop Now", ar: "تسوّق الآن" },
  "hero.cta-locations": { en: "Our Branches", ar: "فروعنا" },
  "hero.variant2-title": { en: "Your Pet Deserves the Best", ar: "حيوانك الأليف يستحق الأفضل" },
  "hero.variant2-sub": { en: "Shop premium food, toys & supplies", ar: "تسوّق أطعمة وألعاب ومستلزمات مميزة" },
  "hero.variant3-title": { en: "Pet Store Kuwait", ar: "بت ستور الكويت" },
  "hero.variant3-sub": {
    en: "Your Dependable Partner in PetHood",
    ar: "شريكك الموثوق في عالم الحيوانات الأليفة",
  },

  // Features
  "feature.delivery": { en: "Fast Delivery", ar: "توصيل سريع" },
  "feature.delivery-desc": { en: "Same-day delivery across Kuwait", ar: "توصيل في نفس اليوم لجميع أنحاء الكويت" },
  "feature.pickup": { en: "In-Store Pickup", ar: "استلام من الفرع" },
  "feature.pickup-desc": { en: "Pick up from any of our 3 branches", ar: "استلام من أي فرع من فروعنا الثلاثة" },
  "feature.branches": { en: "3 Locations", ar: "3 فروع" },
  "feature.branches-desc": { en: "Salmiya, Al Rai & Mahboula", ar: "السالمية والري والهبولة" },
  "feature.quality": { en: "Quality Products", ar: "منتجات عالية الجودة" },
  "feature.quality-desc": { en: "Trusted brands for your pets", ar: "علامات تجارية موثوقة لحيواناتك" },

  // Categories / Sections
  "section.shop-by-pet": { en: "Shop by Pet Type", ar: "تسوّق حسب نوع الحيوان" },
  "section.all-categories": { en: "All Categories", ar: "جميع الفئات" },
  "section.featured": { en: "Featured Products", ar: "منتجات مميزة" },
  "section.popular": { en: "Popular Products", ar: "الأكثر مبيعاً" },
  "section.new-arrivals": { en: "New Arrivals", ar: "وصل حديثاً" },
  "section.on-sale": { en: "On Sale", ar: "عروض خصم" },
  "section.view-all": { en: "View All", ar: "عرض الكل" },
  "section.our-branches": { en: "Our Branches", ar: "فروعنا" },
  "section.contact-us": { en: "Contact Us", ar: "اتصل بنا" },

  // Search
  "search.placeholder": { en: "Search products...", ar: "ابحث عن منتجات..." },
  "search.button": { en: "Search", ar: "بحث" },

  // Products
  "product.all": { en: "All Products", ar: "جميع المنتجات" },
  "product.found": { en: "product(s) found", ar: "منتج (منتجات)" },
  "product.search": { en: "Search products...", ar: "ابحث عن منتجات..." },
  "product.not-found": { en: "No products found", ar: "لا توجد منتجات" },
  "product.clear-filter": { en: "Clear filter", ar: "إزالة الفلتر" },
  "product.sort-latest": { en: "Latest", ar: "الأحدث" },
  "product.sort-price-asc": { en: "Price: Low to High", ar: "السعر: من الأقل للأعلى" },
  "product.sort-price-desc": { en: "Price: High to Low", ar: "السعر: من الأعلى للأقل" },
  "product.sort-rating": { en: "Best Rated", ar: "الأعلى تقييماً" },
  "product.sort-name": { en: "Name: A-Z", ar: "الاسم: أ-ي" },
  "product.in-stock": { en: "In Stock", ar: "متوفر" },
  "product.out-of-stock": { en: "Out of Stock", ar: "غير متوفر" },
  "product.add-to-cart": { en: "Add to Cart", ar: "أضف إلى السلة" },
  "product.buy-now": { en: "Buy Now", ar: "اشترِ الآن" },
  "product.view-cart": { en: "View in Cart", ar: "عرض في السلة" },
  "product.related": { en: "Related Products", ar: "منتجات ذات صلة" },
  "product.reviews": { en: "reviews", ar: "تقييم" },
  "product.save": { en: "Save", ar: "توفير" },
  "product.back": { en: "Back to Shop", ar: "العودة للمتجر" },
  "product.details": { en: "Product Details", ar: "تفاصيل المنتج" },
  "product.quantity": { en: "Quantity", ar: "الكمية" },

  // Cart
  "cart.title": { en: "Shopping Cart", ar: "سلة التسوق" },
  "cart.empty": { en: "Your cart is empty", ar: "سلتك فارغة" },
  "cart.empty-desc": { en: "Add some products to get started", ar: "أضف بعض المنتجات للبدء" },
  "cart.emptyMessage": { en: "Add some products to get started", ar: "أضف بعض المنتجات للبدء" },
  "cart.item": { en: "item", ar: "منتج" },
  "cart.items": { en: "items", ar: "منتجات" },
  "cart.subtotal": { en: "Subtotal", ar: "المجموع الفرعي" },
  "cart.delivery-fee": { en: "Delivery Fee", ar: "رسوم التوصيل" },
  "cart.delivery": { en: "Delivery", ar: "التوصيل" },
  "cart.free": { en: "Free", ar: "مجاني" },
  "cart.total": { en: "Total", ar: "المجموع" },
  "cart.checkout": { en: "Proceed to Checkout", ar: "إتمام الدفع" },
  "cart.continue": { en: "Continue Shopping", ar: "متابعة التسوق" },
  "cart.remove": { en: "Remove", ar: "إزالة" },
  "cart.view-cart": { en: "View Cart & Checkout", ar: "عرض السلة والدفع" },
  "cart.viewCheckout": { en: "View Cart & Checkout", ar: "عرض السلة والدفع" },
  "cart.startShopping": { en: "Start Shopping", ar: "ابدأ التسوق" },

  // Checkout
  "checkout.title": { en: "Checkout", ar: "الدفع" },
  "checkout.delivery": { en: "Delivery", ar: "توصيل" },
  "checkout.pickup": { en: "Pickup", ar: "استلام" },
  "checkout.select-branch": { en: "Select Branch", ar: "اختر الفرع" },
  "checkout.contact": { en: "Contact Information", ar: "معلومات الاتصال" },
  "checkout.address": { en: "Delivery Address", ar: "عنوان التوصيل" },
  "checkout.area": { en: "Area", ar: "المنطقة" },
  "checkout.street": { en: "Street", ar: "الشارع" },
  "checkout.building": { en: "Building", ar: "المبنى" },
  "checkout.floor": { en: "Floor", ar: "الطابق" },
  "checkout.apartment": { en: "Apartment", ar: "الشقة" },
  "checkout.landmark": { en: "Nearest Landmark", ar: "أقرب معلم" },
  "checkout.payment": { en: "Payment Method", ar: "طريقة الدفع" },
  "checkout.summary": { en: "Order Summary", ar: "ملخص الطلب" },
  "checkout.place-order": { en: "Place Order", ar: "تأكيد الطلب" },
  "checkout.name": { en: "Full Name", ar: "الاسم الكامل" },
  "checkout.email": { en: "Email", ar: "البريد الإلكتروني" },
  "checkout.phone": { en: "Phone", ar: "رقم الهاتف" },
  "checkout.knet": { en: "KNET", ar: "كي نت" },
  "checkout.knet-desc": { en: "Debit Card", ar: "بطاقة مدين" },
  "checkout.credit-card": { en: "Credit Card", ar: "بطاقة ائتمان" },
  "checkout.credit-desc": { en: "Visa / Mastercard", ar: "فيزا / ماستركارد" },
  "checkout.apple-pay": { en: "Apple Pay", ar: "أبل باي" },
  "checkout.apple-pay-desc": { en: "Pay with Apple", ar: "ادفع عبر أبل" },
  "checkout.google-pay": { en: "Google Pay", ar: "جوجل باي" },
  "checkout.google-pay-desc": { en: "Pay with Google", ar: "ادفع عبر جوجل" },
  "checkout.secure": { en: "Secured by UPayments (Sandbox)", ar: "مدفوعات آمنة عبر UPayments (تجريبي)" },
  "checkout.required": { en: "Required", ar: "مطلوب" },
  "checkout.failed": { en: "Payment failed. Please try again.", ar: "فشلت عملية الدفع. حاول مرة أخرى." },
  "checkout.test-card-note": {
    en: "Sandbox test card: 8888 8800 0000 0001 | Any 4-digit PIN",
    ar: "بطاقة اختبار: 8888 8800 0000 0001 | أي رقم سري 4 أرقام",
  },
  "checkout.method": { en: "Delivery Method", ar: "طريقة التوصيل" },
  "checkout.deliveryMethod": { en: "Delivery", ar: "توصيل" },
  "checkout.pickupMethod": { en: "Pickup", ar: "استلام" },
  "checkout.processing": { en: "Processing...", ar: "جاري المعالجة..." },
  "checkout.fullName": { en: "Full Name", ar: "الاسم الكامل" },
  "checkout.fullNamePlaceholder": { en: "Enter your full name", ar: "أدخل اسمك الكامل" },
  "checkout.emailPlaceholder": { en: "example@email.com", ar: "example@email.com" },
  "checkout.phoneLabel": { en: "Phone Number", ar: "رقم الهاتف" },
  "checkout.areaBlock": { en: "Area / Block", ar: "المنطقة / القطعة" },
  "checkout.areaPlaceholder": { en: "e.g. Hawalli", ar: "مثال: حولي" },
  "checkout.streetPlaceholder": { en: "Street number/name", ar: "رقم الشارع" },
  "checkout.buildingHouse": { en: "Building / House", ar: "المبنى / المنزل" },
  "checkout.buildingPlaceholder": { en: "Building number", ar: "رقم المبنى" },
  "checkout.floorPlaceholder": { en: "Floor number", ar: "رقم الطابق" },
  "checkout.apartmentPlaceholder": { en: "Apartment number", ar: "رقم الشقة" },
  "checkout.landmarkPlaceholder": { en: "Near...", ar: "بجانب..." },
  "checkout.landmarkLabel": { en: "Landmark", ar: "علامة مميزة" },
  "checkout.subtotal": { en: "Subtotal", ar: "المجموع الفرعي" },
  "checkout.total": { en: "Total", ar: "الإجمالي" },
  "checkout.deliveryTotal": { en: "Delivery", ar: "التوصيل" },
  "checkout.free": { en: "Free", ar: "مجاني" },
  "checkout.selectBranch": { en: "Please select a branch", ar: "اختر فرعاً" },
  "checkout.errFullName": { en: "Full name is required", ar: "الاسم مطلوب" },
  "checkout.errEmail": { en: "Email is required", ar: "البريد الإلكتروني مطلوب" },
  "checkout.errPhone": { en: "Phone is required", ar: "رقم الهاتف مطلوب" },
  "checkout.errArea": { en: "Area is required", ar: "المنطقة مطلوبة" },
  "checkout.errStreet": { en: "Street is required", ar: "الشارع مطلوب" },
  "checkout.errBuilding": { en: "Building is required", ar: "المبنى مطلوب" },
  "checkout.errGeneric": { en: "An error occurred. Please try again.", ar: "حدث خطأ. حاول مرة أخرى." },
  "checkout.errPayment": { en: "Payment failed. Please try a different method.", ar: "فشل الدفع. يرجى تجربة طريقة أخرى." },
  "checkout.secureBy": { en: "Secured by UPayments", ar: "مدفوعات آمنة عبر UPayments" },

  // Order Success
  "order.success-title": { en: "Order Confirmed!", ar: "تم تأكيد الطلب!" },
  "order.success-desc": {
    en: "Thank you for your order. We'll start processing it right away.",
    ar: "شكراً لطلبك. سنبدأ في معالجته فوراً.",
  },
  "order.id": { en: "Order ID", ar: "رقم الطلب" },
  "order.next-title": { en: "What Happens Next?", ar: "ماذا يحدث بعد ذلك؟" },
  "order.next-1": {
    en: "We'll verify your payment and confirm your order",
    ar: "سنقوم بالتحقق من الدفع وتأكيد الطلب",
  },
  "order.next-2": {
    en: "Your order will be prepared for delivery/pickup",
    ar: "سيتم تجهيز طلبك للتوصيل/الاستلام",
  },
  "order.next-3": { en: "You'll receive a confirmation notification", ar: "ستتلقى إشعار تأكيد" },
  "order.continue": { en: "Continue Shopping", ar: "متابعة التسوق" },
  "order.back-home": { en: "Back to Home", ar: "العودة للرئيسية" },
  "order.cart": { en: "Shopping Cart", ar: "سلة التسوق" },
  "order.empty": { en: "Your cart is empty", ar: "سلتك فارغة" },
  "order.emptyCTA": { en: "Add some products to your cart!", ar: "أضف بعض المنتجات لسلتك!" },
  "order.deliveryFreeNote": { en: "Free delivery on orders over 10 KWD", ar: "توصيل مجاني للطلبات فوق 10 د.ك" },
  "order.deliveryFee": { en: "Delivery fee:", ar: "رسوم التوصيل:" },
  "order.pickupAny": { en: "Pickup from any branch", ar: "الاستلام من أي فرع" },
  "order.proceedCheckout": { en: "Proceed to Checkout", ar: "المتابعة للدفع" },

  // Footer
  "footer.desc": {
    en: "Your Dependable partner in PetHood. Premium pet supplies, food, toys & accessories for cats, dogs, birds, fish, rabbits, hamsters & reptiles in Kuwait.",
    ar: "شريكك الموثوق في عالم الحيوانات الأليفة. مستلزمات وأطعمة وألعاب وإكسسوارات مميزة للقطط والكلاب والطيور والأسماك والأرانب والهامستر والزواحف في الكويت.",
  },
  "footer.quick-links": { en: "Quick Links", ar: "روابط سريعة" },
  "footer.pet-types": { en: "Pet Types", ar: "أنواع الحيوانات" },
  "footer.customer-service": { en: "Customer Service", ar: "خدمة العملاء" },
  "footer.follow-us": { en: "Follow Us", ar: "تابعنا" },
  "footer.all-rights": { en: "Pet Store Kuwait. All rights reserved.", ar: "بت ستور الكويت. جميع الحقوق محفوظة." },
  "footer.contact-us": { en: "Contact Us", ar: "اتصل بنا" },
  "footer.about": { en: "About Us", ar: "عن المتجر" },
  "footer.faq": { en: "FAQ", ar: "الأسئلة الشائعة" },
  "footer.returns": { en: "Returns & Exchanges", ar: "الإرجاع والاستبدال" },
  "footer.privacy": { en: "Privacy Policy", ar: "سياسة الخصوصية" },

  // Branches
  "branch.salmiya": { en: "Salmiya (City Centre)", ar: "السالمية (سيتي سنتر)" },
  "branch.alrai": { en: "Al Rai", ar: "الري" },
  "branch.mahboula": { en: "Mahboula", ar: "المهبولة" },
  "branch.get-directions": { en: "Get Directions", ar: "احصل على الاتجاهات" },
  "branch.call-now": { en: "Call Now", ar: "اتصل الآن" },
  "branch.hours": { en: "Working Hours", ar: "ساعات العمل" },
  "branch.daily": { en: "Daily 10:00 AM - 10:00 PM", ar: "يومياً من 10:00 صباحاً حتى 10:00 مساءً" },
  "branch.mapTitle": { en: "Branch Locations", ar: "خريطة الفروع" },
  "branch.viewOnMaps": { en: "View on Google Maps", ar: "عرض على خرائط جوجل" },
  "branch.workingHoursDesc": {
    en: "All branches open Daily 10:00 AM - 10:00 PM",
    ar: "جميع الفروع مفتوحة يومياً من 10:00 صباحاً إلى 10:00 مساءً",
  },
  "branch.orderOnlineTitle": {
    en: "Order Online for Delivery or Pickup",
    ar: "اطلب عبر الإنترنت",
  },
  "branch.orderOnlineDesc": {
    en: "Browse our complete collection and get it delivered to your door or pick up from any branch",
    ar: "اطلب عبر الإنترنت للتوصيل أو الاستلام من الفرع",
  },
  "branch.shopNow": { en: "Shop Now", ar: "تسوق الآن" },

  // Badges
  "badge.sale": { en: "Sale", ar: "تخفيض" },
  "badge.new": { en: "New", ar: "جديد" },
  "badge.featured": { en: "Featured", ar: "مميز" },
  "badge.popular": { en: "Popular", ar: "الأكثر مبيعاً" },
  "badge.best-seller": { en: "Best Seller", ar: "الأكثر رواجاً" },
  "badge.out-of-stock": { en: "Out of Stock", ar: "غير متوفر" },
  "badge.in-stock": { en: "In Stock", ar: "متوفر" },

  // Trust
  "trust.secure-payment": { en: "Secure Payment", ar: "دفع آمن" },
  "trust.secure-payment-desc": { en: "UPayments protected", ar: "محمي بواسطة UPayments" },
  "trust.fast-delivery": { en: "Fast Delivery", ar: "توصيل سريع" },
  "trust.fast-delivery-desc": { en: "Same-day across Kuwait", ar: "في نفس اليوم لجميع أنحاء الكويت" },
  "trust.support": { en: "24/7 Support", ar: "دعم على مدار الساعة" },
  "trust.support-desc": { en: "WhatsApp us anytime", ar: "تواصل معنا عبر واتساب" },

  // Contact
  "contact.title": { en: "Contact Us", ar: "اتصل بنا" },
  "contact.subtitle": {
    en: "We're here to help. Reach out to us in the way that works best for you",
    ar: "نحن هنا لمساعدتك. تواصل معنا بالطريقة التي تفضلها",
  },
  "contact.whatsapp": { en: "WhatsApp Us", ar: "راسلنا واتساب" },
  "contact.instagram": { en: "Follow on Instagram", ar: "تابعنا على انستغرام" },
  "contact.website": { en: "Visit Website", ar: "زيارة الموقع" },
  "contact.sendMessage": { en: "Send Us a Message", ar: "أرسل لنا رسالة" },
  "contact.name": { en: "Name", ar: "الاسم" },
  "contact.namePh": { en: "Your full name", ar: "اسمك الكامل" },
  "contact.phone": { en: "Phone", ar: "الهاتف" },
  "contact.phonePh": { en: "Your phone number", ar: "رقم هاتفك" },
  "contact.subject": { en: "Subject", ar: "الموضوع" },
  "contact.message": { en: "Message", ar: "الرسالة" },
  "contact.messagePh": { en: "Type your message here...", ar: "اكتب رسالتك هنا..." },
  "contact.sendBtn": { en: "Send Message", ar: "إرسال الرسالة" },
  "contact.followup": {
    en: "We'll get back to you via WhatsApp or email",
    ar: "سنتواصل معك عبر واتساب أو البريد الإلكتروني",
  },
  "contact.getInTouch": { en: "Get in Touch", ar: "تواصل معنا" },
  "contact.subjGeneral": { en: "General Inquiry", ar: "استفسار عام" },
  "contact.subjOrder": { en: "Order Issue", ar: "مشكلة في الطلب" },
  "contact.subjProduct": { en: "Product Question", ar: "سؤال عن منتج" },
  "contact.subjFeedback": { en: "Feedback", ar: "ملاحظات" },
  "contact.getDirections": { en: "Get Directions", ar: "الحصول على الاتجاهات" },
  "contact.hours": { en: "10:00 AM - 10:00 PM", ar: "10:00 ص - 10:00 م" },
  "contact.phoneLabel": { en: "Phone", ar: "الهاتف" },
  "contact.websiteLabel": { en: "Website", ar: "الموقع" },

  // About
  "about.title": { en: "About Pet Store", ar: "عن بت ستور" },
  "about.mission": { en: "Our Mission", ar: "مهمتنا" },
  "about.mission-desc": {
    en: "We are Kuwait's trusted pet store, providing quality pet food, accessories, and care products since day one. With 3 branches across Kuwait, we serve thousands of happy pet owners daily.",
    ar: "نحن المتجر الموثوق للحيوانات الأليفة في الكويت، نوفر أطعمة ومستلزمات ومنتجات رعاية عالية الجودة منذ اليوم الأول. مع 3 فروع في جميع أنحاء الكويت، نخدم آلاف أصحاب الحيوانات السعداء يومياً.",
  },
  "about.story": { en: "Our Story", ar: "قصتنا" },
  "about.storyP1": {
    en: "Pet Store is Kuwait's trusted destination for all your pet needs. Since our founding, we have dedicated ourselves to providing the finest pet food, accessories, and care products from reputable international brands.",
    ar: "بيتو ستور هي وجهتك الموثوقة في الكويت لجميع احتياجات حيوانك الأليف. منذ تأسيسنا، كرّسنا جهودنا لتقديم أجود أنواع طعام الحيوانات والإكسسوارات ومنتجات العناية من علامات تجارية عالمية موثوقة.",
  },
  "about.storyP2": {
    en: "With three branches across Kuwait, we strive to provide an exceptional shopping experience for pet owners, backed by a team of experts ready to help you choose what's best for your furry friend.",
    ar: "مع ثلاثة فروع في جميع أنحاء الكويت، نسعى دائماً لتوفير تجربة تسوق مميزة ل أصحاب الحيوانات الأليفة، مع فريق من الخبراء المستعدين لمساعدتك في اختيار الأنسب لحيوانك الأليف.",
  },
  "about.values": { en: "What We Stand For", ar: "ما نؤمن به" },
  "about.valuesSub": { en: "The values that guide everything we do", ar: "القيم التي توجه كل ما نفعله" },
  "about.vQuality": { en: "Quality", ar: "الجودة" },
  "about.vQualityDesc": { en: "We only stock trusted, premium brands", ar: "نخزّن فقط العلامات التجارية الموثوقة والفاخرة" },
  "about.vCare": { en: "Care", ar: "الرعاية" },
  "about.vCareDesc": { en: "Every pet deserves the best", ar: "كل حيوان أليف يستحق الأفضل" },
  "about.vCommunity": { en: "Community", ar: "المجتمع" },
  "about.vCommunityDesc": { en: "Serving thousands of happy pet owners", ar: "نخدم آلاف أصحاب الحيوانات الأليفة السعداء" },
  "about.vConvenience": { en: "Convenience", ar: "الراحة" },
  "about.vConvenienceDesc": { en: "Delivery & pickup across Kuwait", ar: "التوصيل والاستلام في جميع أنحاء الكويت" },
  "about.branchesSub": { en: "Three convenient locations across Kuwait", ar: "ثلاثة فروع في جميع أنحاء الكويت" },
  "about.viewAll": { en: "View All Locations", ar: "عرض جميع الفروع" },
  "about.shopTitle": { en: "Shop for Your Pet Today", ar: "تسوّق لحيوانك اليوم" },
  "about.shopDesc": { en: "Browse our complete collection of quality pet products", ar: "تصفّح مجموعتنا الكاملة من المنتجات" },

  // Brand
  "brand.name": { en: "Pet Store", ar: "بت ستور" },

  // Bottom Nav
  "bottomNav.home": { en: "Home", ar: "الرئيسية" },
  "bottomNav.shop": { en: "Shop", ar: "المتجر" },
  "bottomNav.categories": { en: "Categories", ar: "الفئات" },
  "bottomNav.cart": { en: "Cart", ar: "السلة" },
  "bottomNav.contact": { en: "Contact", ar: "اتصل" },

  // Pet Names
  "pets.cat": { en: "Cats", ar: "القطط" },
  "pets.dog": { en: "Dogs", ar: "الكلاب" },
  "pets.bird": { en: "Birds", ar: "الطيور" },
  "pets.fish": { en: "Fish", ar: "الأسماك" },
  "pets.rabbit": { en: "Rabbits", ar: "الأرانب" },
  "pets.hamster": { en: "Hamsters", ar: "الهامستر" },
  "pets.reptile": { en: "Reptiles", ar: "الزواحف" },

  // Footer extra keys
  "footer.tagline": { en: "Your Dependable Partner in PetHood", ar: "شريكك الموثوق في عالم الحيوانات الأليفة" },
  "footer.petTypes": { en: "Pet Types", ar: "أنواع الحيوانات" },
  "footer.customerService": { en: "Customer Service", ar: "خدمة العملاء" },
  "footer.links.about": { en: "About Us", ar: "عن المتجر" },
  "footer.links.contact": { en: "Contact Us", ar: "اتصل بنا" },
  "footer.links.faq": { en: "FAQ", ar: "الأسئلة الشائعة" },
  "footer.links.returns": { en: "Returns & Exchanges", ar: "الإرجاع والاستبدال" },
  "footer.links.privacy": { en: "Privacy Policy", ar: "سياسة الخصوصية" },
  "footer.branches": { en: "Our Branches", ar: "فروعنا" },
  "footer.workingHours": { en: "Daily 10AM - 10PM", ar: "يومياً 10 صباحاً - 10 مساءً" },

  // Branches extra keys
  "branches.salmiya": { en: "Salmiya (City Centre)", ar: "السالمية (سيتي سنتر)" },
  "branches.alrai": { en: "Al Rai", ar: "الري" },
  "branches.mahboula": { en: "Mahboula", ar: "المهبولة" },

  // Aria
  "aria.toggle-language": { en: "Toggle language", ar: "تبديل اللغة" },
  "aria.search": { en: "Search", ar: "بحث" },
  "aria.cart": { en: "Cart", ar: "السلة" },
  "aria.menu": { en: "Menu", ar: "القائمة" },
  "aria.close": { en: "Close", ar: "إغلاق" },
  "aria.open-cart": { en: "Open cart", ar: "فتح السلة" },

  // Checkout
  "checkout.cash-on-delivery": { en: "Cash on Delivery", ar: "الدفع عند الاستلام" },
  "checkout.cod-desc": { en: "Pay when you receive", ar: "ادفع عند استلام طلبك" },

  // WhatsApp
  "whatsapp.chat": { en: "Chat with us", ar: "تحدث معنا" },
  "whatsapp.message": { en: "Hi! I'd like to know more about your pet products.", ar: "مرحباً! أريد معرفة المزيد عن منتجاتكم." },

  // Order
  "order.step-1-desc": { en: "Your payment will be verified shortly", ar: "سيتم التحقق من عملية الدفع الخاصة بك" },
  "order.step-2-desc": { en: "We'll prepare your order with care", ar: "سنحضر طلبك بعناية" },
  "order.step-3-desc": { en: "We'll send you a confirmation via email", ar: "سنرسل لك تأكيداً عبر البريد الإلكتروني" },

  // Contact
  "contact.success": { en: "Your message has been sent successfully! We'll get back to you soon.", ar: "تم إرسال رسالتك بنجاح! سنتواصل معك قريباً." },

  // Lang
  "lang.en": { en: "EN", ar: "EN" },
  "lang.ar": { en: "AR", ar: "AR" },
};

export function t(key: string, locale: Locale): string {
  const entry = translations[key];
  if (!entry) {
    console.warn(`Missing translation key: "${key}"`);
    return key;
  }
  return entry[locale] ?? entry.en ?? key;
}

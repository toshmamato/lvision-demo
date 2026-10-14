
const ld = (k, d) => {
    try {
        const v = JSON.parse(localStorage.getItem(k));
        return v == null ? d : v;
    } catch (e) {
        return d;
    }
};

const sv = (k, v) => {
    try {
        localStorage.setItem(k, JSON.stringify(v));
    } catch (e) {}
};

const $ = s => document.querySelector(s);
const fmt = n => Math.round(n).toLocaleString('ru-RU').replace(/\s/g, ' ') + " сум";

/* 4 ta asosiy katalog */
const CATS = [
    "MARRY ME",
    "L VISION BY INOSHKINS",
    "LV FLOWERS",
    "COFE BY INOSHKINS"
];

const SZ = ["S", "M", "L", "XL", "Standard"];

/* Barcha kataloglarning mahsulotlari */
const RAW = [
    /* MARRY ME */
    ["Diamond Proposal Ring", "MARRY ME", 1250000, 1500000, "#e2e8f0"],
    ["Bridal Veil & Tiara Set", "MARRY ME", 890000, 0, "#f1f5f9"],
    ["Wedding Decor Box", "MARRY ME", 650000, 800000, "#cbd5e1"],
    ["Luxury Proposal Velvet Case", "MARRY ME", 350000, 0, "#94a3b8"],

    /* L VISION BY INOSHKINS */
    ["Vision Noir Hoodie", "L VISION BY INOSHKINS", 599000, 799000, "#3d3d3d"],
    ["Atelier Silk Long Sleeve", "L VISION BY INOSHKINS", 349000, 459000, "#8a8a8a"],
    ["Monolith Oversized Tee", "L VISION BY INOSHKINS", 279000, 0, "#b9b9b9"],
    ["Charcoal Cardigan", "L VISION BY INOSHKINS", 689000, 859000, "#555555"],

    /* LV FLOWERS */
    ["Royal White Roses Bouquet", "LV FLOWERS", 450000, 550000, "#f8fafc"],
    ["Velvet Red Rose Box", "LV FLOWERS", 520000, 0, "#991b1b"],
    ["Pastel Peony Luxe Arrangement", "LV FLOWERS", 680000, 800000, "#fbcfe8"],
    ["Eternity Glass Rose Collection", "LV FLOWERS", 390000, 0, "#e2e8f0"],

    /* COFE BY INOSHKINS */
    ["Signature Americano", "COFE BY INOSHKINS", 25000, 0, "#6f4e37"],
    ["Classic Cappuccino", "COFE BY INOSHKINS", 32000, 38000, "#c49a6c"],
    ["Caramel Latte", "COFE BY INOSHKINS", 35000, 0, "#b98250"],
    ["Iced Vanilla Coffee", "COFE BY INOSHKINS", 38000, 45000, "#d6b58c"]
];

/* Mahsulot obyektlarini yaratish */
const mk = () => RAW.map((r, i) => {
    const coffee = r[1] === "COFE BY INOSHKINS";

    return {
        id: i + 1,
        name: r[0],
        cat: r[1],
        price: r[2],
        old: r[3],
        g: r[4],
        nw: i % 4 === 0,
        stock: coffee
            ? { S: 0, M: 0, L: 0, XL: 0, Standard: 10 }
            : { S: 5, M: 5, L: 5, XL: 5, Standard: 10 },
        desc: coffee
            ? `${r[0]} — COFE BY INOSHKINS qahva kolleksiyasidan. Mazali ta'm va sifatli tayyorlanish.`
            : `Премиальная продукция коллекции ${r[1]}. Эксклюзивный дизайн и высочайшее качество L Vision.`,
        spec: coffee
            ? ["COFE BY INOSHKINS", "Sifatli qahva", "Yangi tayyorlanadi"]
            : ["Эксклюзивный бренд L Vision", "Гарантия качества", "Премиальная упаковка"]
    };
});

/*
 * Eski localStorage ma'lumotlarini saqlab qolish.
 * Yetishmayotgan yangi mahsulotlar qo'shiladi.
 */
const BASE = mk();
const SAVED = ld('lv-p', null);

let P = Array.isArray(SAVED) ? SAVED : BASE;

if (Array.isArray(SAVED)) {
    let changed = false;

    BASE.forEach(product => {
        const exists = P.some(p => Number(p.id) === product.id);

        if (!exists) {
            P.push(product);
            changed = true;
        }
    });

    if (changed) sv('lv-p', P);
} else {
    sv('lv-p', P);
}

let fav = ld('lv-f', []);
let cart = ld('lv-c', []);
let orders = ld('lv-o', []);
let mock = ld('lv-m', [
    {
        no: "LV-DEMO-101",
        total: 798000,
        status: "Доставляется",
        who: "Демо-клиент A"
    }
]);

let F = {
    q: "",
    cat: "",
    size: "",
    max: 2000000,
    av: false,
    sort: "new",
    open: false
};

let CK = {
    step: 1,
    name: "",
    phone: "",
    addr: "",
    del: "std",
    pay: "pre50",
    err: {}
};

let promo = ld('lv-promo', "");
let prof = ld('lv-prof', {
    name: "Демо Клиент",
    phone: "+998 90 000 00 00"
});

let promos = ld('lv-pr', {
    LVISION10: { pct: 10 },
    WELCOME: { off: 50000 }
});

const DL = ld('lv-dl', null) || (() => {
    const d = Date.now() + 2 * 864e5 + 36e5;
    sv('lv-dl', d);
    return d;
})();

const pid = id => P.find(p => p.id == id);
const disc = p => p.old ? Math.round((1 - p.price / p.old) * 100) : 0;
const tot = p => Object.values(p.stock || {}).reduce((a, b) => a + b, 0);

let IMG = ld('lv-img', {});

/* Katalog rasmlari uchun shakllar */
const PATH = {
    "MARRY ME":
        "M50 20 L65 40 L85 45 L70 60 L75 80 L50 70 L25 80 L30 60 L15 45 L35 40 Z",

    "L VISION BY INOSHKINS":
        "M30 15L10 32l9 13 9-5v65h44V40l9 5 9-13L70 15Q50 30 30 15Z",

    "LV FLOWERS":
        "M50 15 C60 5, 75 20, 65 35 C80 35, 85 55, 70 65 C75 80, 55 85, 50 70 C45 85, 25 80, 30 65 C15 55, 20 35, 35 35 C25 20, 40 5, 50 15 Z",

    "COFE BY INOSHKINS":
        "M22 30 H72 V77 Q72 91 58 91 H36 Q22 91 22 77 Z M72 42 H81 Q94 42 94 55 Q94 68 72 68 M17 103 H80 M34 18 Q27 10 34 4 M49 18 Q42 10 49 4 M64 18 Q57 10 64 4"
};

/* Mahsulot yoki katalog rasmi */
function art(p, v = 0) {
    const c = p.cat || p.ck;
    const d = PATH[c] || PATH["L VISION BY INOSHKINS"];
    const key = p.id
        ? 'p:' + p.id
        : p.ck
            ? 'c:' + p.ck
            : '';

    const categoryIndex = CATS.indexOf(p.ck) + 1;

    const image = key
        ? `<img class="ph"
             src="${IMG[key] || 'img/' + (p.id ? 'p-' + p.id : 'cat-' + categoryIndex) + '.jpg'}"
             alt="${p.name || p.ck || ''}"
             loading="lazy"
             onerror="this.remove()">`
        : '';

    return `
        <svg class="g"
             viewBox="0 0 100 120"
             style="${v ? `transform:rotate(${v * 4}deg) scale(${1 + v * .06})` : ''}">
            <path d="${d}"
                  fill="${p.g || '#555'}"
                  stroke="#fff3"
                  stroke-width=".6"
                  stroke-linejoin="round"/>
        </svg>
        ${image}
    `;
}

/* Ikonkalar */
const ICO = {
    h: '<svg viewBox="0 0 24 24"><path d="M12 21s-8-5.5-8-11a4.5 4.5 0 018-2.5A4.5 4.5 0 0120 10c0 5.500-8 11-8 11z"/></svg>',
    b: '<svg viewBox="0 0 24 24"><path d="M5 8h14l-1 12H6zM9 8a3 3 0 016 0"/></svg>',
    s: '<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="6"/><path d="M16 16l4 4"/></svg>',
    sun: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.500 1.500M17.500 17.500L19 19M5 19l1.500-1.500M17.500 6.500L19 5"/></svg>',
    moon: '<svg viewBox="0 0 24 24"><path d="M20 14A8 8 0 019.500 4 8 8 0 1020 14z"/></svg>',
    home: '<svg viewBox="0 0 24 24"><path d="M4 11l8-7 8 7v9H4z"/></svg>',
    grid: '<svg viewBox="0 0 24 24"><path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z"/></svg>',
    u: '<svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/></svg>'
};

const th = () => document.documentElement.dataset.theme;

/* Bildirishnoma */
function toast(t) {
    const e = $('#ts');
    if (!e) return;

    e.textContent = t;
    e.classList.add('on');

    clearTimeout(toast.t);
    toast.t = setTimeout(() => e.classList.remove('on'), 1800);
}

/* Header va mobil navigatsiya */
function chrome() {
    const r = location.hash.slice(2).split('/')[0];

    const ic = $('#ic');
    const bn = $('#bn');

    if (ic) {
        ic.innerHTML = `
            <button class="ib" data-a="go" data-v="catalog" data-focus="1" aria-label="Поиск">${ICO.s}</button>
            <a class="ib" href="#/fav" aria-label="Избранное">
                ${ICO.h}${fav.length ? `<i class="bd">${fav.length}</i>` : ''}
            </a>
            <button class="ib" data-a="cart" aria-label="Корзина">
                ${ICO.b}${cart.length ? `<i class="bd">${cart.reduce((a, c) => a + c.qty, 0)}</i>` : ''}
            </button>
            <button class="ib" data-a="theme" aria-label="Тема">
                ${th() == 'dark' ? ICO.sun : ICO.moon}
            </button>
        `;
    }

    if (bn) {
        bn.innerHTML = [
            ["", ICO.home, "Главная", 0],
            ["catalog", ICO.grid, "Каталог", 0],
            ["fav", ICO.h, "Избранное", fav.length],
            ["cart", ICO.b, "Корзина", cart.reduce((x, c) => x + c.qty, 0)],
            ["profile", ICO.u, "Профиль", 0]
        ].map(a => {
            const badge = a[3] ? `<i class="bd">${a[3]}</i>` : '';

            return a[0] === "cart"
                ? `<a role="button" data-a="cart">${a[1]}${a[2]}${badge}</a>`
                : `<a href="#/${a[0]}" class="${r == a[0] ? 'on' : ''}">${a[1]}${a[2]}${badge}</a>`;
        }).join('');
    }
}

/* Aksiya taymeri */
function cdown() {
    const d = Math.max(0, DL - Date.now());
    const h = Math.floor(d / 36e5);
    const m = Math.floor(d % 36e5 / 6e4);
    const s = Math.floor(d % 6e4 / 1e3);

    return [h, m, s].map(x => String(x).padStart(2, '0')).join(':');
}

setInterval(() => {
    document.querySelectorAll('.cd').forEach(e => {
        e.textContent = cdown();
    });
}, 1000);

/* Mahsulot kartasi */
function card(p) {
    const out = tot(p) === 0;

    return `
        <a class="card rv" href="#/p/${p.id}">
            <div class="img">
                ${p.nw
                    ? '<span class="tag">НОВОЕ</span>'
                    : p.old
                        ? `<span class="tag">−${disc(p)}%</span>`
                        : ''
                }

                <button class="fv ${fav.includes(p.id) ? 'on' : ''}"
                        data-a="fav"
                        data-id="${p.id}"
                        aria-label="Избранное">${ICO.h}</button>

                ${art(p)}

                ${out ? '' : `
                    <button class="qa" data-a="qa" data-id="${p.id}">
                        Быстро добавить
                    </button>
                `}
            </div>

            <h3>${p.name}</h3>
            <div class="cap" style="margin-top:3px">${p.cat}</div>

            <div class="pr">
                <span>${fmt(p.price)}</span>
                ${p.old ? `<s>${fmt(p.old)}</s>` : ''}
            </div>
        </a>
    `;
}

/* Katalog uchun rangni xavfsiz aniqlash */
function catColor(category) {
    const item = RAW.find(r => r[1] === category);
    return item ? item[4] : '#555555';
}

/* Bosh sahifa */
const home = () => {
    const nw = P.filter(p => p.nw).slice(0, 4);
    const ft = P.filter(p => p.old).slice(0, 4);

    return `
        <div class="w sb">
            <button class="pill" data-a="go" data-v="catalog">
                Поиск по разделам...
            </button>
        </div>

        <div class="hero">
            <div class="spot" id="spot"></div>
            <div class="w">
                <div>
                    <p class="cap" style="margin-bottom:22px">2026 · Exclusive Collection</p>
                    <h1 id="h1">DEFINED<br>BY VISION.</h1>
                    <p class="cap" style="margin:22px 0 32px">L Vision by Inoshkins.</p>
                    <a class="btn" href="#/catalog">EXPLORE CATALOG</a>
                </div>

                <div class="img hv" id="hv">
                    ${art({ cat: "L VISION BY INOSHKINS", g: "#cfcfcf" })}
                    <span class="fchip">NEW<small>2026 · DEMO</small></span>
                </div>
            </div>
        </div>

        <section style="padding:34px 0 0">
            <div class="w">
                <div class="sty">
                    ${CATS.map(c => `
                        <a href="#/catalog/${encodeURIComponent(c)}">
                            <div class="ring">
                                <div class="img">
                                    ${art({ cat: c, g: catColor(c), ck: c })}
                                </div>
                            </div>
                            <span style="font-size:11px;font-weight:600">${c}</span>
                        </a>
                    `).join('')}
                </div>
            </div>
        </section>

        <section>
            <div class="w">
                <div class="hd">
                    <h2>Новинки</h2>
                    <a class="cap" href="#/catalog">Все →</a>
                </div>
                <div class="grid snap">${nw.map(card).join('')}</div>
            </div>
        </section>

        <section>
            <div class="w">
                <div class="hd"><h2>Главные разделы</h2></div>
                <div class="tiles">
                    ${CATS.map(c => `
                        <a class="tile rv" href="#/catalog/${encodeURIComponent(c)}">
                            <div class="img">
                                ${art({ cat: c, g: catColor(c), ck: c })}
                            </div>
                            <span style="font-weight:700">${c}</span>
                        </a>
                    `).join('')}
                </div>
            </div>
        </section>

        <section>
            <div class="w">
                <div class="hd">
                    <h2>Подборка</h2>
                    <a class="cap" href="#/catalog">Каталог →</a>
                </div>
                <div class="grid">${ft.map(card).join('')}</div>
            </div>
        </section>

        ${foot()}
    `;
};

/* Footer */
const foot = () => `
    <footer>
        <div class="w">
            <div class="cols">
                <div>
                    <div class="logo">L <b>VISION</b></div>
                    <p>by Inoshkins</p>
                    <p>Демо-магазин</p>
                </div>

                <div>
                    <p class="cap">Разделы</p>
                    ${CATS.map(c => `
                        <a href="#/catalog/${encodeURIComponent(c)}">${c}</a>
                    `).join('')}
                </div>

                <div>
                    <p class="cap">Помощь</p>
                    <a href="#/profile">Заказы</a>
                    <a href="#/admin">Админка</a>
                </div>

                <div>
                    <p class="cap">Новости</p>
                    <input placeholder="Email (демо)">
                    <button class="btn f" style="margin-top:8px" data-a="news">
                        Подписаться
                    </button>
                </div>
            </div>

            <div class="giant">L VISION</div>
        </div>
    </footer>
`;

/* Mahsulotlarni filtrlash */
function flt() {
    return P.filter(p =>
        (!F.cat || p.cat === F.cat) &&
        p.name.toLowerCase().includes(F.q.toLowerCase()) &&
        p.price <= F.max &&
        (!F.av || tot(p) > 0)
    ).sort((a, b) =>
        F.sort === "lo"
            ? a.price - b.price
            : F.sort === "hi"
                ? b.price - a.price
                : b.id - a.id
    );
}

function gridH() {
    const l = flt();

    return l.length
        ? l.map(card).join('')
        : `
            <div class="box" style="grid-column:1/-1;text-align:center;padding:50px">
                <p>Ничего не найдено</p>
                <button class="btn o" style="margin-top:16px" data-a="clr">
                    Сбросить фильтры
                </button>
            </div>
        `;
}

/* Katalog sahifasi: 4 ta bo'lim */
const catalog = () => `
    <div class="w" style="padding-top:36px;padding-bottom:60px">
        <div class="hd">
            <h2>Каталог</h2>
            <button class="btn o fv2" data-a="fo">Фильтры</button>
        </div>

        <div style="display:flex;gap:12px;margin-bottom:28px;overflow-x:auto;padding-bottom:8px">
            <button class="chip ${F.cat === '' ? 'on' : ''}"
                    data-a="fc"
                    data-v=""
                    style="padding:12px 20px;font-weight:700">
                ВСЕ
            </button>

            ${CATS.map(c => `
                <button class="chip ${F.cat === c ? 'on' : ''}"
                        data-a="fc"
                        data-v="${c}"
                        style="padding:12px 20px;font-weight:700">
                    ${c}
                </button>
            `).join('')}
        </div>

        <div class="cat">
            <div class="fl ${F.open ? 'open' : ''}" id="fl">
                <div class="cap">Поиск</div>
                <input id="q" data-f="q" placeholder="Название..." value="${F.q}">

                <label class="cap">Раздел</label>
                <div>
                    ${['', ...CATS].map(c => `
                        <span class="chip ${F.cat === c ? 'on' : ''}"
                              data-a="fc"
                              data-v="${c}">
                            ${c || 'Все'}
                        </span>
                    `).join('')}
                </div>

                <label class="cap">Цена: до ${fmt(F.max)}</label>
                <input type="range"
                       data-f="max"
                       min="200000"
                       max="2000000"
                       step="50000"
                       value="${F.max}">

                <label>
                    <input type="checkbox"
                           style="width:auto"
                           data-f="av"
                           ${F.av ? 'checked' : ''}>
                    Только в наличии
                </label>

                <label class="cap">Сортировка</label>
                <select data-f="sort">
                    <option value="new" ${F.sort === 'new' ? 'selected' : ''}>Новые</option>
                    <option value="lo" ${F.sort === 'lo' ? 'selected' : ''}>Дешевле → дороже</option>
                    <option value="hi" ${F.sort === 'hi' ? 'selected' : ''}>Дороже → дешевле</option>
                </select>

                <button class="btn o f" style="margin-top:16px" data-a="clr">
                    Сбросить
                </button>
            </div>

            <div class="grid" id="g">${gridH()}</div>
        </div>
    </div>

    ${foot()}
`;

/* Mahsulot sahifasi */
function prod(id) {
    const p = pid(id);

    if (!p) {
        return `
            <div class="w" style="padding:80px 20px">
                <h2>Товар не найден</h2>
                <a class="btn" style="margin-top:20px" href="#/catalog">В каталог</a>
            </div>
        `;
    }

    const sel = window.sel && window.sel.id == id
        ? window.sel
        : (window.sel = { id: Number(id), size: "Standard", qty: 1, v: 0 });

    return `
        <div class="w" style="padding-top:30px">
            <div class="pd">
                <div>
                    <div class="img" id="mi">${art(p, sel.v)}</div>
                </div>

                <div>
                    <p class="cap">${p.cat}</p>
                    <h1 style="font-size:36px;margin:10px 0 14px">${p.name}</h1>

                    <div class="pr" style="font-size:24px">
                        <span>${fmt(p.price)}</span>
                        ${p.old ? `<s>${fmt(p.old)}</s>` : ''}
                    </div>

                    <p style="color:var(--m);margin:16px 0">${p.desc}</p>

                    <div style="display:flex;gap:10px;align-items:center;margin-top:20px">
                        <div class="q">
                            <button data-a="pq" data-v="-1">−</button>
                            <span>${sel.qty}</span>
                            <button data-a="pq" data-v="1">+</button>
                        </div>

                        <button class="btn" style="flex:1" data-a="padd" data-id="${p.id}">
                            В корзину
                        </button>

                        <button class="ib"
                                style="border:1px solid var(--l)"
                                data-a="fav"
                                data-id="${p.id}">
                            ${fav.includes(p.id) ? '♥' : '♡'}
                        </button>
                    </div>
                </div>
            </div>
        </div>

        ${foot()}
    `;
}

/* Sevimlilar */
const favs = () => {
    const l = P.filter(p => fav.includes(p.id));

    return `
        <div class="w" style="padding:36px 20px 60px">
            <div class="hd"><h2>Избранное</h2></div>

            ${l.length
                ? `<div class="grid">${l.map(card).join('')}</div>`
                : `
                    <div class="box" style="text-align:center;padding:70px 20px">
                        <p>В избранном пока пусто</p>
                        <a class="btn" href="#/catalog" style="margin-top:16px">В каталог</a>
                    </div>
                `
            }
        </div>
    `;
};

/* Savat summasi */
function totals() {
    const sub = cart.reduce(
        (a, c) => a + (pid(c.id)?.price || 0) * c.qty,
        0
    );

    const pr = promos[promo];
    const d = pr
        ? (pr.pct ? Math.round(sub * pr.pct / 100) : Math.min(pr.off, sub))
        : 0;

    return { sub, d, t: sub - d };
}

/* Savatga mahsulot qo'shish */
function addC(id, size, q) {
    const p = pid(id);

    if (!p) return;

    const ex = cart.find(c => c.id == id && c.size === (size || 'Standard'));

    if (ex) {
        ex.qty += q;
    } else {
        cart.push({ id: Number(id), size: size || 'Standard', qty: q });
    }

    sv('lv-c', cart);
    toast(p.name + " добавлен в корзину");
    chrome();

    const dr = $('#dr');
    if (dr && dr.classList.contains('open')) drawer();
}

/* Savat oynasi */
function drawer() {
    const T = totals();
    const dr = $('#dr');

    if (!dr) return;

    dr.innerHTML = `
        <div style="padding:18px 22px;display:flex;justify-content:space-between;border-bottom:1px solid var(--l)">
            <span class="cap">Корзина</span>
            <button data-a="cx">✕</button>
        </div>

        <div style="flex:1;overflow:auto;padding:0 22px">
            ${cart.length
                ? cart.map((c, i) => {
                    const p = pid(c.id);
                    if (!p) return '';

                    return `
                        <div class="li">
                            <div class="img">${art(p)}</div>

                            <div style="flex:1">
                                <p>${p.name}</p>
                                <p class="cap">${fmt(p.price)}</p>

                                <div class="q" style="margin-top:8px">
                                    <button data-a="cq" data-i="${i}" data-v="-1">−</button>
                                    <span>${c.qty}</span>
                                    <button data-a="cq" data-i="${i}" data-v="1">+</button>
                                </div>
                            </div>

                            <button class="cap" data-a="cr" data-i="${i}">✕</button>
                        </div>
                    `;
                }).join('')
                : '<p style="text-align:center;padding:60px 0">Корзина пуста</p>'
            }
        </div>

        ${cart.length
            ? `
                <div style="padding:18px 22px;border-top:1px solid var(--l)">
                    <p style="display:flex;justify-content:space-between;margin-bottom:14px">
                        <b>Итого</b>
                        <b>${fmt(T.t)}</b>
                    </p>
                    <a class="btn f" href="#/checkout" data-a="cx">Оформить заказ</a>
                </div>
            `
            : ''
        }
    `;
}

function openD(o) {
    drawer();

    const dr = $('#dr');
    const ov = $('#ov');

    if (dr) dr.classList.toggle('open', o);
    if (ov) ov.classList.toggle('open', o);
}

/* Sahifalarni ko'rsatish */
function render() {
    const h = location.hash.slice(2).split('/');
    const r = h[0];

    let v;

    if (r === "catalog") {
        if (h[1]) {
            F.cat = decodeURIComponent(h[1]);
        } else if (render.lastRoute !== "catalog") {
            F.cat = "";
        }

        v = catalog();
    } else if (r === "p") {
        v = prod(h[1]);
    } else if (r === "fav") {
        v = favs();
    } else {
        v = home();
    }

    render.lastRoute = r;

    const a = $('#app');
    if (!a) return;

    a.style.opacity = 0;
    a.innerHTML = v;

    requestAnimationFrame(() => {
        a.style.transition = 'opacity .35s';
        a.style.opacity = 1;
    });

    if (!render.k || render.k !== location.hash) {
        window.scrollTo(0, 0);
    }

    render.k = location.hash;

    chrome();
    obs();
}

/* Animatsiyalar */
function obs() {
    if (!('IntersectionObserver' in window)) {
        document.querySelectorAll('.rv').forEach(e => e.classList.add('in'));
        return;
    }

    const io = new IntersectionObserver(es => {
        es.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add('in');
                io.unobserve(e.target);
            }
        });
    }, { threshold: .1 });

    document.querySelectorAll('.rv').forEach(e => io.observe(e));
}

/* Barcha tugmalar */
document.addEventListener('click', e => {
    const t = e.target.closest('[data-a]');
    if (!t) return;

    const a = t.dataset.a;
    const d = t.dataset;

    if (a === "theme") {
        const n = th() === 'dark' ? 'light' : 'dark';
        document.documentElement.dataset.theme = n;
        sv('lv-theme', n);
        chrome();
    } else if (a === "cart") {
        openD(true);
    } else if (a === "cx") {
        openD(false);
    } else if (a === "go") {
        const target = '#/' + d.v;
        if (location.hash === target) {
            render();
        } else {
            location.hash = target;
        }
    } else if (a === "fav") {
        e.preventDefault();

        const i = Number(d.id);
        fav = fav.includes(i)
            ? fav.filter(x => x !== i)
            : [...fav, i];

        sv('lv-f', fav);
        render();
    } else if (a === "qa") {
        e.preventDefault();
        addC(Number(d.id), "Standard", 1);
    } else if (a === "fc") {
        const category = d.v || '';
        const target = category
            ? '#/catalog/' + encodeURIComponent(category)
            : '#/catalog';

        if (location.hash === target) {
            F.cat = category;
            render();
        } else {
            location.hash = target;
        }
    } else if (a === "fo") {
        F.open = !F.open;

        const fl = $('#fl');
        if (fl) fl.classList.toggle('open', F.open);
    } else if (a === "clr") {
        F = {
            q: "",
            cat: "",
            size: "",
            max: 2000000,
            av: false,
            sort: "new",
            open: F.open
        };

        location.hash = '#/catalog';
        render();
    } else if (a === "pq") {
        if (window.sel) {
            window.sel.qty = Math.max(1, window.sel.qty + Number(d.v));
            render();
        }
    } else if (a === "padd") {
        if (window.sel) {
            addC(window.sel.id, window.sel.size, window.sel.qty);
        } else {
            addC(Number(d.id), "Standard", 1);
        }
    } else if (a === "cq") {
        const c = cart[Number(d.i)];

        if (c) {
            c.qty = Math.max(1, c.qty + Number(d.v));
            sv('lv-c', cart);
            drawer();
            chrome();
        }
    } else if (a === "cr") {
        cart.splice(Number(d.i), 1);
        sv('lv-c', cart);
        drawer();
        chrome();
    } else if (a === "news") {
        toast("Подписка оформлена (демо)");
    }
});

/* Intro ekranini avtomatik yopish */
function hideIntro() {
    const intro = document.getElementById('in');

    if (intro) {
        setTimeout(() => {
            intro.style.transition = 'opacity 0.6s ease';
            intro.style.opacity = '0';

            setTimeout(() => {
                intro.style.display = 'none';
            }, 600);
        }, 1200);
    }
}

/* Filtrlar */
document.addEventListener('input', e => {
    const t = e.target;

    if (!t.dataset.f) return;

    const key = t.dataset.f;

    F[key] = t.type === 'checkbox'
        ? t.checked
        : key === 'max'
            ? Number(t.value)
            : t.value;

    const g = $('#g');
    if (g) g.innerHTML = gridH();

    if (key === 'q' || key === 'max' || key === 'av' || key === 'sort') {
        const fl = $('#fl');
        if (fl) fl.classList.toggle('open', F.open);
    }
});

/* Sahifani boshlash */
window.addEventListener('load', () => {
    render();
    hideIntro();
});

window.addEventListener('hashchange', render);

/* Saqlangan tema */
const savedTheme = ld('lv-theme', null);
if (savedTheme) {
    document.documentElement.dataset.theme = savedTheme;
}

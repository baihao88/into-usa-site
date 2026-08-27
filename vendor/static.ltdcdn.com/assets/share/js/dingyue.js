(function (global) {
    'use strict';

    var currentLocale = 'zh-cn';
    var currentMessages = null;

    var INTL_LOCALE_MAP = {
        'zh-cn': 'zh-CN',
        'zh': 'zh-TW',
        'en': 'en-US',
        'it': 'it-IT',
        'jp': 'ja-JP',
        'kr': 'ko-KR',
        'de': 'de-DE',
        'es': 'es-ES',
        'pt': 'pt-PT',
        'sa': 'ar',
        'fr': 'fr-FR',
        'ru': 'ru-RU',
        'vm': 'vi-VN',
        'in': 'hi-IN',
        'th': 'th-TH',
        'ir': 'fa-IR',
        'my': 'ms-MY',
        'se': 'sv-SE',
        'tr': 'tr-TR',
        'mm': 'my-MM',
        'ua': 'uk-UA'
    };

    var LOCALE_MESSAGES = {
        'zh-cn': {
            titleDefault: '订阅站点更新提醒',
            titleWithSite: '订阅 {siteName}<br/>站点更新提醒',
            description: '扫码关注公众号<br>站点更新将通过公众号消息推送',
            // footerText: '本站站点内容更新提醒功能<br>由枢纽云<b>营销SaaS公众号</b>提供服务',
            loading: '二维码加载中',
            qrAlt: '订阅二维码',
            expiresIn: '{minutes}分钟内有效',
            generatedAt: '{datetime}生成'
        },
        'zh': {
            titleDefault: '訂閱站點更新提醒',
            titleWithSite: '訂閱 {siteName}<br/>站點更新提醒',
            description: '掃碼關注公眾號<br>站點更新將透過公眾號訊息推送',
            loading: 'QR 碼載入中',
            qrAlt: '訂閱 QR 碼',
            expiresIn: '{minutes} 分鐘內有效',
            generatedAt: '{datetime} 產生'
        },
        'en': {
            titleDefault: 'Subscribe to site updates',
            titleWithSite: 'Subscribe to {siteName}<br/>site update alerts',
            description: 'Scan the QR code to follow our WeChat account<br>Get notified when this site is updated',
            loading: 'Loading QR code',
            qrAlt: 'Subscription QR code',
            expiresIn: 'Valid for {minutes} minutes',
            generatedAt: 'Generated at {datetime}'
        },
        'jp': {
            titleDefault: 'サイト更新通知を購読',
            titleWithSite: '{siteName} の<br/>更新通知を購読',
            description: 'QRコードをスキャンしてWeChat公式アカウントをフォロー<br>サイト更新時に通知を受け取れます',
            loading: 'QRコードを読み込み中',
            qrAlt: '購読用QRコード',
            expiresIn: '{minutes}分間有効',
            generatedAt: '{datetime} 生成'
        },
        'kr': {
            titleDefault: '사이트 업데이트 알림 구독',
            titleWithSite: '{siteName}<br/>사이트 업데이트 알림 구독',
            description: 'QR 코드를 스캔하여 WeChat 공식 계정을 팔로우하세요<br>사이트가 업데이트되면 알림을 받습니다',
            loading: 'QR 코드 불러오는 중',
            qrAlt: '구독 QR 코드',
            expiresIn: '{minutes}분간 유효',
            generatedAt: '{datetime} 생성'
        },
        'de': {
            titleDefault: 'Website-Updates abonnieren',
            titleWithSite: '{siteName}<br/>Update-Benachrichtigungen abonnieren',
            description: 'QR-Code scannen, um unser WeChat-Konto zu folgen<br>Benachrichtigung bei Website-Updates erhalten',
            loading: 'QR-Code wird geladen',
            qrAlt: 'Abonnement-QR-Code',
            expiresIn: '{minutes} Minuten gültig',
            generatedAt: 'Erstellt am {datetime}'
        },
        'es': {
            titleDefault: 'Suscribirse a actualizaciones del sitio',
            titleWithSite: 'Suscribirse a {siteName}<br/>alertas de actualización',
            description: 'Escanee el código QR para seguir nuestra cuenta de WeChat<br>Reciba avisos cuando se actualice el sitio',
            loading: 'Cargando código QR',
            qrAlt: 'Código QR de suscripción',
            expiresIn: 'Válido por {minutes} minutos',
            generatedAt: 'Generado el {datetime}'
        },
        'pt': {
            titleDefault: 'Subscrever atualizações do site',
            titleWithSite: 'Subscrever {siteName}<br/>alertas de atualização',
            description: 'Digitalize o código QR para seguir a nossa conta WeChat<br>Receba notificações quando o site for atualizado',
            loading: 'A carregar código QR',
            qrAlt: 'Código QR de subscrição',
            expiresIn: 'Válido por {minutes} minutos',
            generatedAt: 'Gerado em {datetime}'
        },
        'it': {
            titleDefault: 'Iscriviti agli aggiornamenti del sito',
            titleWithSite: 'Iscriviti a {siteName}<br/>avvisi di aggiornamento',
            description: 'Scansiona il codice QR per seguire il nostro account WeChat<br>Ricevi notifiche quando il sito viene aggiornato',
            loading: 'Caricamento codice QR',
            qrAlt: 'Codice QR di iscrizione',
            expiresIn: 'Valido per {minutes} minuti',
            generatedAt: 'Generato il {datetime}'
        },
        'fr': {
            titleDefault: "S'abonner aux mises à jour du site",
            titleWithSite: "S'abonner à {siteName}<br/>alertes de mise à jour",
            description: 'Scannez le code QR pour suivre notre compte WeChat<br>Recevez une notification lors des mises à jour du site',
            loading: 'Chargement du code QR',
            qrAlt: "Code QR d'abonnement",
            expiresIn: 'Valable {minutes} minutes',
            generatedAt: 'Généré le {datetime}'
        },
        'ru': {
            titleDefault: 'Подписка на обновления сайта',
            titleWithSite: 'Подписка на {siteName}<br/>уведомления об обновлениях',
            description: 'Отсканируйте QR-код, чтобы подписаться на WeChat<br>Получайте уведомления об обновлениях сайта',
            loading: 'Загрузка QR-кода',
            qrAlt: 'QR-код подписки',
            expiresIn: 'Действителен {minutes} мин.',
            generatedAt: 'Создан {datetime}'
        },
        'vm': {
            titleDefault: 'Đăng ký cập nhật trang web',
            titleWithSite: 'Đăng ký {siteName}<br/>thông báo cập nhật',
            description: 'Quét mã QR để theo dõi tài khoản WeChat<br>Nhận thông báo khi trang web được cập nhật',
            loading: 'Đang tải mã QR',
            qrAlt: 'Mã QR đăng ký',
            expiresIn: 'Có hiệu lực trong {minutes} phút',
            generatedAt: 'Tạo lúc {datetime}'
        },
        'th': {
            titleDefault: 'สมัครรับการอัปเดตเว็บไซต์',
            titleWithSite: 'สมัครรับ {siteName}<br/>การแจ้งเตือนอัปเดต',
            description: 'สแกน QR Code เพื่อติดตามบัญชี WeChat<br>รับการแจ้งเตือนเมื่อเว็บไซต์มีการอัปเดต',
            loading: 'กำลังโหลด QR Code',
            qrAlt: 'QR Code สำหรับสมัคร',
            expiresIn: 'ใช้ได้ {minutes} นาที',
            generatedAt: 'สร้างเมื่อ {datetime}'
        },
        'sa': {
            titleDefault: 'اشترك في تحديثات الموقع',
            titleWithSite: 'اشترك في {siteName}<br/>تنبيهات التحديث',
            description: 'امسح رمز QR لمتابعة حساب WeChat<br>احصل على إشعار عند تحديث الموقع',
            loading: 'جارٍ تحميل رمز QR',
            qrAlt: 'رمز QR للاشتراك',
            expiresIn: 'صالح لمدة {minutes} دقيقة',
            generatedAt: 'تم الإنشاء في {datetime}'
        },
        'ir': {
            titleDefault: 'اشتراک در به‌روزرسانی‌های سایت',
            titleWithSite: 'اشتراک در {siteName}<br/>هشدارهای به‌روزرسانی',
            description: 'برای دنبال کردن حساب WeChat، QR را اسکن کنید<br>با به‌روزرسانی سایت اطلاع‌رسانی دریافت کنید',
            loading: 'در حال بارگذاری QR',
            qrAlt: 'QR اشتراک',
            expiresIn: 'معتبر برای {minutes} دقیقه',
            generatedAt: 'ایجاد شده در {datetime}'
        },
        'in': {
            titleDefault: 'साइट अपडेट की सदस्यता लें',
            titleWithSite: '{siteName}<br/>साइट अपडेट अलर्ट की सदस्यता',
            description: 'WeChat खाता फॉलो करने के लिए QR कोड स्कैन करें<br>साइट अपडेट होने पर सूचना पाएं',
            loading: 'QR कोड लोड हो रहा है',
            qrAlt: 'सदस्यता QR कोड',
            expiresIn: '{minutes} मिनट तक मान्य',
            generatedAt: '{datetime} को बनाया गया'
        },
        'my': {
            titleDefault: 'Langgan kemas kini laman web',
            titleWithSite: 'Langgan {siteName}<br/>amaran kemas kini',
            description: 'Imbas kod QR untuk ikuti akaun WeChat kami<br>Dapatkan pemberitahuan apabila laman web dikemas kini',
            loading: 'Memuatkan kod QR',
            qrAlt: 'Kod QR langganan',
            expiresIn: 'Sah selama {minutes} minit',
            generatedAt: 'Dijana pada {datetime}'
        },
        'se': {
            titleDefault: 'Prenumerera på webbplatsuppdateringar',
            titleWithSite: 'Prenumerera på {siteName}<br/>uppdateringsaviseringar',
            description: 'Skanna QR-koden för att följa vårt WeChat-konto<br>Få avisering när webbplatsen uppdateras',
            loading: 'Laddar QR-kod',
            qrAlt: 'Prenumerations-QR-kod',
            expiresIn: 'Giltig i {minutes} minuter',
            generatedAt: 'Skapad {datetime}'
        },
        'tr': {
            titleDefault: 'Site güncellemelerine abone ol',
            titleWithSite: '{siteName}<br/>güncelleme bildirimlerine abone ol',
            description: 'WeChat hesabımızı takip etmek için QR kodu tarayın<br>Site güncellendiğinde bildirim alın',
            loading: 'QR kodu yükleniyor',
            qrAlt: 'Abonelik QR kodu',
            expiresIn: '{minutes} dakika geçerli',
            generatedAt: '{datetime} tarihinde oluşturuldu'
        },
        'mm': {
            titleDefault: 'ဝဘ်ဆိုက် အပ်ဒိတ်များကို စာရင်းသွင်းပါ',
            titleWithSite: '{siteName}<br/>အပ်ဒိတ်သတိပေးချက်များကို စာရင်းသွင်းပါ',
            description: 'WeChat အကောင့်ကို follow လုပ်ရန် QR ကုဒ်ကို scan လုပ်ပါ<br>ဝဘ်ဆိုက် အပ်ဒိတ်ဖြစ်သည့်အခါ အကြောင်းကြားချက်ရယူပါ',
            loading: 'QR ကုဒ် လုပ်ဆောင်နေသည်',
            qrAlt: 'စာရင်းသွင်းမှု QR ကုဒ်',
            expiresIn: '{minutes} မိနစ်အတွင်း အကျုံးဝင်သည်',
            generatedAt: '{datetime} တွင် ဖန်တီးထားသည်'
        },
        'ua': {
            titleDefault: 'Підписка на оновлення сайту',
            titleWithSite: 'Підписка на {siteName}<br/>сповіщення про оновлення',
            description: 'Відскануйте QR-код, щоб підписатися на WeChat<br>Отримуйте сповіщення про оновлення сайту',
            loading: 'Завантаження QR-коду',
            qrAlt: 'QR-код підписки',
            expiresIn: 'Дійсний {minutes} хв.',
            generatedAt: 'Створено {datetime}'
        }
    };

    var LOCALE_ALIAS = {
        'zh-cn': 'zh-cn',
        'zh-hans': 'zh-cn',
        'zh-hant': 'zh',
        'zh-tw': 'zh',
        'zh-hk': 'zh',
        'ja': 'jp',
        'ja-jp': 'jp',
        'ko': 'kr',
        'ko-kr': 'kr',
        'vi': 'vm',
        'vi-vn': 'vm',
        'ar': 'sa',
        'fa': 'ir',
        'hi': 'in',
        'sv': 'se',
        'sv-se': 'se',
        'uk': 'ua',
        'pt-br': 'pt'
    };

    function normalizeLocale(locale) {
        var raw = (locale || global.__DINGYUE_LOCALE__ || 'zh-cn')
            .toString()
            .trim()
            .toLowerCase()
            .replace(/_/g, '-');
        return LOCALE_ALIAS[raw] || raw;
    }

    function escapeHtml(text) {
        return String(text)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function interpolate(template, params) {
        if (!template) {
            return '';
        }
        return template.replace(/\{(\w+)\}/g, function (_, key) {
            return params && params[key] != null ? params[key] : '';
        });
    }

    function t(key, params) {
        var dict = currentMessages || LOCALE_MESSAGES['zh-cn'];
        return interpolate(dict[key] || LOCALE_MESSAGES['zh-cn'][key] || key, params || {});
    }

    function formatDateTime(date) {
        var intlLocale = INTL_LOCALE_MAP[currentLocale] || currentLocale;
        try {
            return new Intl.DateTimeFormat(intlLocale, {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            }).format(date);
        } catch (error) {
            var now = date;
            return now.getFullYear() + '-' +
                String(now.getMonth() + 1).padStart(2, '0') + '-' +
                String(now.getDate()).padStart(2, '0') + ' ' +
                String(now.getHours()).padStart(2, '0') + ':' +
                String(now.getMinutes()).padStart(2, '0');
        }
    }

    function isDefaultSiteName(name) {
        if (!name) {
            return true;
        }
        return /未输入|官微中心/.test(name);
    }

    function buildTitle(siteName) {
        var name = (siteName || '').trim();
        if (!name || isDefaultSiteName(name)) {
            return t('titleDefault');
        }
        return t('titleWithSite', {
            siteName: '<span class="dingyue-title-website-name">' + escapeHtml(name) + '</span>'
        });
    }

    function loadLocale(locale) {
        var normalized = normalizeLocale(locale);
        currentLocale = normalized;
        currentMessages = LOCALE_MESSAGES[normalized] || LOCALE_MESSAGES['zh-cn'];
        return Promise.resolve(currentMessages);
    }

    global.dingyueI18n = {
        t: t,
        loadLocale: loadLocale,
        buildTitle: buildTitle,
        formatDateTime: formatDateTime,
        escapeHtml: escapeHtml,
        normalizeLocale: normalizeLocale,
        getLocale: function () {
            return currentLocale;
        }
    };
})(typeof window !== 'undefined' ? window : this);

const dingyue = {
    style: `
        /* 订阅弹窗样式 */
        .dingyue-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 20001;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
        }

        .dingyue-modal.dingyue-modal-show {
            opacity: 1;
            visibility: visible;
        }

        .dingyue-modal-overlay {
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.6);
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
            box-sizing: border-box;
        }

        .dingyue-modal-content {
            background-color: #fff;
            border-radius: 12px;
            padding: 0;
            width: 100%;
            max-width: 320px;
            position: relative;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
            transform: scale(0.8);
            transition: transform 0.3s ease;
            padding: 10px;
        }

        .dingyue-modal-show .dingyue-modal-content {
            transform: scale(1);
        }

        .dingyue-modal-close {
            position: absolute;
            top: 3px;
            right: 3px;
            width: 30px;
            height: 30px;
            border: none;
            background: transparent;
            cursor: pointer;
            font-size: 20px;
            color: #999;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            transition: all 0.2s ease;
            z-index: 1;
        }

        .dingyue-modal-close:hover {
            background-color: #f5f5f5;
            color: #666;
        }

        /* 第一部分：标题 */
        .dingyue-title {
            padding: 10px 10px 8px 10px;
            text-align: center;
        }

        .dingyue-title{
            margin: 0;
            font-size: 18px;
            color: #333;
            line-height: 1.3;
        }
        .dingyue-title .dingyue-title-website-name {
            font-weight: 600;
            color: #333;
            line-height: 1.3;
        }

        /* 第二部分：描述 */
        .dingyue-description {
            padding: 10px 10px 0 10px;
            text-align: center;
            font-size: 15px;
            color: #888;
            line-height: 1.3;
        }

        /* 第三部分：二维码 */
        .dingyue-qr-code {
            padding: 6px 24px;
            text-align: center;
            display: flex;
            flex-direction: column;
            align-items: center;
            min-height: 202px;
        }

        .dingyue-qr-wrapper {
            position: relative;
            display: inline-block;
            line-height: 0;
        }

        .dingyue-qr-img {
            width: 160px;
            height: 160px;
            border-radius: 8px;
            object-fit: cover;
            display: block;
        }

        .dingyue-qr-logo-box {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: #fff;
            padding: 2px;
            border-radius: 5px;
            box-shadow: 0 1px 5px rgba(0,0,0,0.08);
            width: 36px;
            height: 36px;
            box-sizing: border-box;
        }

        .dingyue-qr-logo-inner {
            /* border: 0.5px solid #f0f0f0; */
            border-radius: 3px;
            width: 32px;
            height: 32px;
            box-sizing: border-box;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
        }

        .dingyue-qr-logo-inner::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 200%;
            height: 200%;
            border: 1px solid #e0e0e0;
            border-radius: 6px;
            transform: scale(0.5);
            transform-origin: 0 0;
            pointer-events: none;
        }

        .dingyue-qr-logo {
            width: 100%;
            height: 100%;
            object-fit: cover;
            display: block;
            border-radius: 3px;
        }
        .dingyue-qr-code .dingyue-expires-text{
            font-size: 12px;
            color: #888;
        }
        .dingyue-qr-code .dingyue-expires-text.font-size-14{
            font-size: 14px;
        }

        .dingyue-loading {
            width: 100%;
            height: 160px;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .dingyue-loading .dingyue-loading-text{
            font-size: 15px;
            color: #aaa;
        }
        .dingyue-loading .dot-loader {
            height: 20px;
            width: 20px;
            border-radius: 50%;
            background-color: #576B96;
            position: relative;
            animation: 1.2s grow ease-in-out infinite;
        }

        @keyframes grow {
            0%, 40%, 100% {
                transform: scale(0);
            }
            40% {
                transform: scale(1);
            }
        }
        .dingyue-loading .dot-loader--2 {
            animation: 1.2s grow ease-in-out infinite 0.15555s;
            margin: 0 20px;
        }
        .dingyue-loading .dot-loader--3 {
            animation: 1.2s grow ease-in-out infinite 0.3s;
        }

        .dingyue-loading .dot-loader--3 {
            animation: 1.2s grow ease-in-out infinite 0.3s;
        }
        /* 第四部分：小字描述 */
        .dingyue-footer {
            padding: 8px 10px 10px 10px;
            text-align: center;
            font-size: 13px;
            color: #999;
            line-height: 1.4;
        }

        /* 响应式适配 */
        @media screen and (max-width: 320px) {
            .dingyue-modal-content {
                max-width: 285px;
            }

            .dingyue-title {
                font-size: 18px;
            }
            .dingyue-title .dingyue-title-website-name {
                font-weight: 600;
                color: #333;
                line-height: 1.3;
            }

            .dingyue-description {
                font-size: 14px;
            }

            .dingyue-qr-code .dingyue-qr-img {
                width: 140px;
                height: 140px;
            }

            .dingyue-qr-logo-box {
                width: 32px;
                height: 32px;
            }

            .dingyue-qr-logo-inner {
                width: 28px;
                height: 28px;
            }

            .dingyue-footer {
                font-size: 12px;
            }    
        }

        @media screen and (min-width: 768px) {
            .dingyue-modal-content {
                max-width: 285px;
            }
        }
    `,
        
    fetch: async (url, method='get', data, options = {}) => {
        const domain = window.location.origin;
        const otherDomain = "https://wei.ltd.com"
        try {
            const useOtherUrl = ['/analyst/event'];
            let baseUrl = domain;
            if(useOtherUrl.includes(url)){
                baseUrl = otherDomain;
            }
            if(method === 'post'){
                options.method = method;
                options.headers = {
                    'Content-Type': 'application/json'
                };
                options.body = JSON.stringify(data);
            }else{
                options.method = method;
                url += "?" + Object.keys(data).map(key => `${key}=${data[key]}`).join('&');
            }
            const response = await fetch(baseUrl + url, options);
        
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            // 检查响应类型，如果是图片类型（如 GIF），直接返回成功状态
            const contentType = response.headers.get('content-type') || '';
            if (contentType.startsWith('image/')) {
                return { code: 0, msg: 'success', data: null };
            }
            
            return await response.json();
        } catch (error) {
            console.error(`ApiService fetch error for url ${url}:`, error);
            // 返回一个符合预期的错误结构，防止后续代码出错
            return { code: -1, msg: error.message, data: null };
        }
    },
    
    sendAnalyst: function(websiteID) {
        const eventData = {
            ..._ga.params,
            referer: location.href,
            website_id: websiteID,
            duration: parseInt(Date.now() / 1000) - _ga['timestamp'],
            relative: '站点订阅: 弹出二维码',
            type: 501,
        }
        return this.fetch('/analyst/event','post', eventData)
    },
    getQRcode: function(websiteID) {
        const url = `/api/subscribe/getSubscribeQrcodeByWebsiteId`;
        const data = {
            website_id: websiteID
        }
        return this.fetch(url,'get', data);
    },
    getWebsiteInfo: function(websiteID, languageType) {
        const url = `/api/getWebsiteInfo`;
        const data = {
            website_id: websiteID,
            language_type: languageType || 'zh-cn'
        }
        return this.fetch(url, 'get', data);
    },
    updateModalTitle: function(siteName) {
        var i18n = typeof window !== 'undefined' ? window.dingyueI18n : null;
        var titleHtml;
        if (i18n) {
            titleHtml = i18n.buildTitle(siteName);
        } else if (!siteName || siteName.includes('未输入') || siteName.includes('官微中心')) {
            titleHtml = '订阅站点更新提醒';
        } else {
            titleHtml = '订阅 <span class="dingyue-title-website-name">' + siteName + '</span><br/>站点更新提醒';
        }
        var titleEl = document.querySelector('.dingyue-modal .dingyue-title');
        if (titleEl) {
            titleEl.innerHTML = titleHtml;
        }
        if (this._modalConfig) {
            this._modalConfig.title = titleHtml;
        }
    },
    resolveSiteName: function(locale, manualName, apiName) {
        manualName = (manualName || '').trim();
        apiName = (apiName || '').trim();
        if ((locale || 'zh-cn') !== 'zh-cn') {
            return apiName;
        }
        return manualName || apiName;
    },
    init: async function(websiteID, options = {}) {
        var i18n = typeof window !== 'undefined' ? window.dingyueI18n : null;
        var locale = options.locale || 'zh-cn';
        var preferApiName = locale !== 'zh-cn';
        if (i18n) {
            await i18n.loadLocale(locale);
        }

        let qrCodeUrl = '';
        const qrPromise = this.getQRcode(websiteID);
        const infoPromise = this.getWebsiteInfo(websiteID, locale);

        const siteName = (options.siteName || options.title || '').trim();
        const siteNameForTitle = preferApiName ? '' : siteName;
        const defaults = {
            title: i18n ? i18n.buildTitle(siteNameForTitle) : siteNameForTitle,
            description: i18n ? i18n.t('description') : '扫码关注公众号<br>站点更新将通过公众号消息推送',
            qrCode: qrCodeUrl,
            logo: '',
            // footerText: i18n ? i18n.t('footerText') : '本站站点内容更新提醒功能<br>由枢纽云<b>营销SaaS公众号</b>提供服务',
            footerText: '本站站点内容更新提醒功能<br>由枢纽云<b>营销SaaS公众号</b>提供服务',
            loadingText: i18n ? i18n.t('loading') : '二维码加载中',
            qrAlt: i18n ? i18n.t('qrAlt') : '订阅二维码',
            closeOnOverlay: true
        };

        const config = Object.assign({}, defaults, options);
        if (i18n) {
            config.title = i18n.buildTitle(siteNameForTitle);
        } else if (!siteNameForTitle || siteNameForTitle.includes('未输入') || siteNameForTitle.includes('官微中心')) {
            config.title = '订阅站点更新提醒';
        } else {
            config.title = '订阅 <span class="dingyue-title-website-name">' + siteNameForTitle + '</span><br/>站点更新提醒';
        }

        this._modalConfig = config;
        this.createModal(config);

        // 等待两个请求都完成
        const [qrRes, infoRes] = await Promise.all([qrPromise, infoPromise]);

        if (infoRes.code === 0 && infoRes.data) {
            const apiName = (infoRes.data.name || '').trim();
            const manualName = (options.siteName || options.title || '').trim();
            const finalName = this.resolveSiteName(locale, manualName, apiName);
            if ((locale || 'zh-cn') !== 'zh-cn' || finalName) {
                this.updateModalTitle(finalName);
            }
        }

        if (qrRes.code === 0) {
            let logoUrl = config.logo;
            if (!logoUrl && infoRes.code === 0 && infoRes.data && infoRes.data.company_logo && infoRes.data.company_logo.id) {
                logoUrl = infoRes.data.company_logo.url;
            }
            this.replaceLoading(qrRes.data.url, qrRes.data?.expire_seconds || null, logoUrl);
            this.sendAnalyst(websiteID);
        }

    },
    replaceLoading: function(qrCodeUrl, expiresSeconds, logoUrl) {
        const qrCode = document.querySelector('.dingyue-qr-code');
        const config = this._modalConfig || {};
        const i18n = typeof window !== 'undefined' ? window.dingyueI18n : null;
        const qrAlt = config.qrAlt || (i18n ? i18n.t('qrAlt') : '订阅二维码');
        let logoHtml = '';
        if (logoUrl && logoUrl.trim()) {
            logoHtml = `
                <div class="dingyue-qr-logo-box">
                    <div class="dingyue-qr-logo-inner">
                        <img class="dingyue-qr-logo" src="${logoUrl.trim()}" alt="logo" />
                    </div>
                </div>
            `;
        }
        qrCode.innerHTML = `
            <div class="dingyue-qr-wrapper">
                <img class="dingyue-qr-img" src="${qrCodeUrl}" alt="${qrAlt}" />
                ${logoHtml}
            </div>
        `;
        if (expiresSeconds && expiresSeconds > 0) {
            const expiresMinutes = Math.floor(expiresSeconds / 60);
            const now = new Date();
            const datetime = i18n ? i18n.formatDateTime(now) : (
                now.getFullYear() + '年' +
                (now.getMonth() + 1) + '月' +
                now.getDate().toString().padStart(2, '0') + '日' +
                now.getHours().toString().padStart(2, '0') + '时' +
                now.getMinutes().toString().padStart(2, '0') + '分'
            );
            const expiresInText = i18n
                ? i18n.t('expiresIn', { minutes: expiresMinutes })
                : expiresMinutes + '分钟内有效';
            const generatedAtText = i18n
                ? i18n.t('generatedAt', { datetime: datetime })
                : datetime + '生成';
            qrCode.innerHTML += `<span class="dingyue-expires-text font-size-14">${expiresInText}</span>
            <span class="dingyue-expires-text">${generatedAtText}</span>`;
        }
    },
    createModal: function(config) {
            
        // 创建弹窗HTML
        const modal = document.createElement('div');
        modal.className = 'dingyue-modal';
        modal.innerHTML = `
            <div class="dingyue-modal-overlay">
                <div class="dingyue-modal-content">
                    <button class="dingyue-modal-close">&times;</button>

                    <!-- 第一部分：标题 -->
                    <div class="dingyue-title">
                        ${config.title}
                    </div>

                    <!-- 第二部分：描述 -->
                    <div class="dingyue-description">
                        ${config.description}
                    </div>

                    <!-- 第三部分：二维码 -->
                    <div class="dingyue-qr-code">
                        <div class="dingyue-loading">
                           <!--<span class="dot-loader"></span>
                           <span class="dot-loader dot-loader--2"></span>
                           <span class="dot-loader dot-loader--3"></span>-->
                            <span class="dingyue-loading-text">${config.loadingText || '二维码加载中'}</span>
                        </div>
                    </div>

                    <!-- 第四部分：小字描述 -->
                    <div class="dingyue-footer" style="display:none;" >
                        ${config.footerText}
                    </div>
                </div>
            </div>
        `;

        // 添加样式
        const style = document.createElement('style');
        style.textContent = this.style;
        document.head.appendChild(style);
        

        // 添加到页面
        document.body.appendChild(modal);

        // 绑定事件
        this.bindEvents(modal, config);

        // 显示动画
        setTimeout(() => {
            modal.classList.add('dingyue-modal-show');
        }, 10);

        return modal;
    },

    bindEvents: function(modal, config) {
        // 关闭按钮事件
        const closeBtn = modal.querySelector('.dingyue-modal-close');
        closeBtn.addEventListener('click', () => {
            this.close(modal);
        });

        // 点击遮罩层关闭
        if (config.closeOnOverlay) {
            const overlay = modal.querySelector('.dingyue-modal-overlay');
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    this.close(modal);
                }
            });
        }

        // ESC键关闭
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                this.close(modal);
            }
        };
        document.addEventListener('keydown', handleEscape);

        // 保存事件处理函数引用，用于清理
        modal._handleEscape = handleEscape;
    },

    close: function(modal) {
        modal.classList.remove('dingyue-modal-show');

        setTimeout(() => {
            document.body.removeChild(modal);
            // 清理事件监听器
            if (modal._handleEscape) {
                document.removeEventListener('keydown', modal._handleEscape);
            }
        }, 300);
    }
};

(function(global) {
    'use strict';
    global.dingyue = dingyue;
})(typeof window !== 'undefined' ? window : this);
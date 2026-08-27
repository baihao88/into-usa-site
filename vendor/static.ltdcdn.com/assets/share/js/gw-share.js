/**
 * GwShare - 通用分享组件
 * 不依赖 jQuery，支持 PC/移动端，支持微信二维码、海报分享、原生系统分享
 *
 * 使用方式：
 *   GwShare.init('#share-content', {
 *     url: 'https://example.com',
 *     copyText: '标题 https://example.com',
 *     title: '页面标题',
 *     description: '页面描述',
 *     image: 'https://example.com/cover.jpg',
 *     sites: ['qzone','qq','weibo','wechat','copy','poster'],
 *     posterItemId: 123,
 *     posterWebsiteId: 456
 *   });
 */
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module !== 'undefined' && module.exports) {
    module.exports = factory();
  } else {
    root.GwShare = factory();
  }
})(this, function () {
  'use strict';

  // 平台分享 URL 模板
  var templates = {
    qzone: 'https://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url={{URL}}&title={{TITLE}}&desc={{DESC}}&summary={{SUMMARY}}&site={{SOURCE}}',
    qq: 'https://connect.qq.com/widget/shareqq/index.html?url={{URL}}&title={{TITLE}}&source={{SOURCE}}&desc={{DESC}}&pics={{IMAGE}}',
    weibo: 'https://service.weibo.com/share/share.php?url={{URL}}&title={{TITLE}}&pic={{IMAGE}}',
    facebook: 'https://www.facebook.com/sharer/sharer.php?u={{URL}}&title={{TITLE}}&description={{DESC}}',
    twitter: 'https://twitter.com/intent/tweet?text={{TITLE}}&url={{URL}}',
    x: 'https://twitter.com/intent/tweet?text={{TITLE}}&url={{URL}}',
    linkedin: 'https://www.linkedin.com/sharing/share-offsite/?url={{URL}}',
    whatsapp: 'https://api.whatsapp.com/send?text={{TITLE}}%20{{URL}}',
    // 以下平台无标准网页分享接口，使用搜索页作为引导
    zhihu: 'https://www.zhihu.com/search?type=content&q={{TITLE}}',
    toutiao: 'https://www.toutiao.com/search?keyword={{TITLE}}',
    sohu: 'https://s.sohu.com/search?keyword={{TITLE}}'
  };

  // 平台名称
  var names = {
    qzone: 'QQ空间',
    qq: 'QQ',
    weibo: '微博',
    wechat: '微信',
    facebook: 'Facebook',
    twitter: 'Twitter',
    x: 'X',
    linkedin: 'LinkedIn',
    whatsapp: 'WhatsApp',
    zhihu: '知乎',
    toutiao: '头条',
    sohu: '搜狐',
    copy: '复制链接',
    poster: '海报分享',
    more: '更多'
  };

  // 默认图标（Font Awesome 4 + 项目 iconfont-copyright）
  var defaultIcons = {
    qzone: '<i class="fa fa-star"></i>',
    qq: '<i class="fa fa-qq"></i>',
    weibo: '<i class="fa fa-weibo"></i>',
    wechat: '<i class="fa fa-weixin"></i>',
    facebook: '<i class="fa fa-facebook"></i>',
    twitter: '<i class="fa fa-twitter"></i>',
    // SVG 保证 hover 填色后仍几何居中（字母 X 字面易偏）
    x: '<svg class="gw-share-x" viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path fill="currentColor" d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>',
    linkedin: '<i class="fa fa-linkedin"></i>',
    whatsapp: '<i class="fa fa-whatsapp"></i>',
    zhihu: '<span class="gw-share-text">知</span>',
    toutiao: '<span class="gw-share-text">头</span>',
    sohu: '<span class="gw-share-text">搜</span>',
    copy: '<i class="fa fa-link"></i>',
    poster: '<span class="iconfont-copyright share-poster"></span>',
    more: '<i class="fa fa-ellipsis-h"></i>'
  };

  var POSTER_JS_URL = '/assets/share/js/poster-generator.js';
  var STYLED_QRCODE_JS_URL = '/assets/share/js/styled-qrcode.js';
  var QRCODE_LIB_URL = 'https://static.ltdcdn.com/assets/cdn/qrcodeGenerator/1.4.4/qrcode.js';

  function encode(str) {
    return encodeURIComponent(str || '');
  }

  // 海报/社交分享需要合法 URL；$text 常是「标题 + 链接」，不能直接 new URL
  function resolvePageUrl(raw) {
    if (!raw) return location.href;
    try {
      return new URL(raw, location.href).href;
    } catch (e) {
      return location.href;
    }
  }

  // 与 gw-share.js 同 CDN 路径加载兄弟脚本，避免写死 /assets 打到错误域名
  function getShareSiblingScriptUrl(fileName, fallback) {
    var scripts = document.querySelectorAll('script[src*="gw-share.js"]');
    if (scripts.length) {
      return scripts[scripts.length - 1].src.replace(/gw-share\.js(?:\?.*)?$/, fileName);
    }
    return fallback;
  }

  function getPosterScriptUrl() {
    return getShareSiblingScriptUrl('poster-generator.js', POSTER_JS_URL);
  }

  function getStyledQrcodeScriptUrl() {
    return getShareSiblingScriptUrl('styled-qrcode.js', STYLED_QRCODE_JS_URL);
  }

  function renderUrl(template, data) {
    return template
      .replace(/{{URL}}/g, encode(data.url))
      .replace(/{{TITLE}}/g, encode(data.title))
      .replace(/{{DESC}}/g, encode(data.description))
      .replace(/{{SUMMARY}}/g, encode(data.description))
      .replace(/{{SOURCE}}/g, encode(data.source))
      .replace(/{{IMAGE}}/g, encode(data.image));
  }

  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      if (document.querySelector('script[src="' + src + '"]')) {
        resolve();
        return;
      }
      var script = document.createElement('script');
      script.src = src;
      script.onload = function () { resolve(); };
      script.onerror = function () { reject(new Error('Failed to load: ' + src)); };
      document.head.appendChild(script);
    });
  }

  function copyText(text, successMsg, failMsg) {
    successMsg = successMsg || '复制成功';
    failMsg = failMsg || '复制失败，请手动复制';

    var fallback = function () {
      var input = document.createElement('input');
      input.value = text;
      input.style.position = 'absolute';
      input.style.left = '-9999px';
      input.style.opacity = '0';
      document.body.appendChild(input);
      input.select();
      try {
        document.execCommand('copy');
        alert(successMsg);
      } catch (err) {
        alert(failMsg);
      }
      document.body.removeChild(input);
    };

    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text)
        .then(function () { alert(successMsg); })
        .catch(function () { fallback(); });
    } else {
      fallback();
    }
  }

  function createQrcodeImage(text, size, logoImg) {
    if (typeof StyledQrcode === 'undefined') {
      console.error('StyledQrcode library is not loaded');
      return '';
    }

    // 高分屏下按 devicePixelRatio 放大画布（至少 2 倍），CSS 里仍按原尺寸显示，避免二维码发虚
    var scale = Math.max(2, Math.min(window.devicePixelRatio || 1, 3));
    var renderSize = Math.round(size * scale);

    var canvas = StyledQrcode.render({
      text: text,
      size: renderSize,
      colorDark: '#000000',
      colorLight: '#ffffff',
      errorCorrectionLevel: 'H'
    });

    if (logoImg) {
      drawLogoOnQrCode(canvas.getContext('2d'), canvas.width, logoImg);
    }

    return canvas.toDataURL('image/png');
  }

  function drawLogoOnQrCode(ctx, size, logoImg) {
    function roundRectPath(ctx, x, y, w, h, r) {
      r = Math.min(r, w / 2, h / 2);
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.arcTo(x + w, y, x + w, y + h, r);
      ctx.arcTo(x + w, y + h, x, y + h, r);
      ctx.arcTo(x, y + h, x, y, r);
      ctx.arcTo(x, y, x + w, y, r);
      ctx.closePath();
    }

    function fillRoundRect(ctx, x, y, w, h, r) {
      roundRectPath(ctx, x, y, w, h, r);
      ctx.fill();
    }

    var boxSize = Math.round(size * 36 / 160);
    var scale = boxSize / 36;
    var outerR = 5 * scale;
    var innerR = 3 * scale;
    var padding = 2 * scale;
    var x = (size - boxSize) / 2;
    var y = (size - boxSize) / 2;
    var inner = boxSize - padding * 2;

    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,0.08)';
    ctx.shadowBlur = 5 * scale;
    ctx.shadowOffsetY = 1 * scale;
    ctx.fillStyle = '#ffffff';
    fillRoundRect(ctx, x, y, boxSize, boxSize, outerR);
    ctx.restore();

    ctx.save();
    roundRectPath(ctx, x + padding, y + padding, inner, inner, innerR);
    ctx.clip();
    // contain 模式等比缩放，非方形 logo 不变形，留白处透出白底
    var ratio = Math.min(inner / logoImg.width, inner / logoImg.height);
    var dw = logoImg.width * ratio;
    var dh = logoImg.height * ratio;
    ctx.drawImage(logoImg, x + padding + (inner - dw) / 2, y + padding + (inner - dh) / 2, dw, dh);
    ctx.restore();

    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = Math.max(0.5, scale);
    roundRectPath(ctx, x + padding, y + padding, inner, inner, innerR);
    ctx.stroke();
  }

  function loadQRCodeLib() {
    return loadScript(QRCODE_LIB_URL).then(function () {
      if (typeof StyledQrcode !== 'undefined') return;
      return loadScript(getStyledQrcodeScriptUrl());
    });
  }

  function generatePoster(opts) {
    if (!opts.posterItemId) {
      alert('海报分享需要配置内容 ID');
      return;
    }

    // 与旧版一致：二维码用当前页/合法 URL，不用复制文案
    var posterUrl = resolvePageUrl(opts.posterUrl || opts.url);

    var doGenerate = function () {
      PosterGenerator.generatePoster(
        opts.posterItemId,
        opts.posterWebsiteId || null,
        posterUrl
      );
    };

    if (typeof PosterGenerator !== 'undefined') {
      doGenerate();
    } else {
      loadScript(getPosterScriptUrl())
        .then(doGenerate)
        .catch(function (err) {
          console.error(err);
          alert('海报组件加载失败');
        });
    }
  }

  function nativeShare(opts) {
    if (navigator.share) {
      navigator.share({
        title: opts.title,
        text: opts.description || opts.title,
        url: opts.url
      }).catch(function () {
        // 用户取消分享，无需处理
      });
    } else {
      alert('当前浏览器不支持系统分享');
    }
  }

  function showWechatQrcode(btn, opts) {
    var existing = btn.querySelector('.gw-wechat-qrcode');
    if (existing) {
      existing.remove();
      return;
    }

    function renderPopup(dataUrl) {
      var wrapper = document.createElement('div');
      wrapper.className = 'gw-wechat-qrcode';
      wrapper.innerHTML =
        '<h4>微信扫一扫</h4>' +
        '<img src="' + dataUrl + '" alt="微信二维码">' +
        '<p>打开微信扫一扫，分享到朋友圈</p>';

      var closeHandler = function (e) {
        if (!wrapper.contains(e.target) && e.target !== btn) {
          wrapper.remove();
          document.removeEventListener('click', closeHandler);
        }
      };

      btn.appendChild(wrapper);

      // translateY(-50%) 容易落在亚像素上导致内容发虚，改为整数 margin-top 垂直居中
      wrapper.style.transform = 'none';
      wrapper.style.marginTop = (-Math.round(wrapper.offsetHeight / 2)) + 'px';

      requestAnimationFrame(function () {
        document.addEventListener('click', closeHandler);
      });
    }

    loadQRCodeLib().then(function () {
      var qrcodeUrl = opts.wechatQrcodeUrl || opts.url;
      if (opts.wechatQrcodeLogo) {
        var logoImg = new Image();
        logoImg.crossOrigin = 'anonymous';
        logoImg.onload = function () {
          var dataUrl = createQrcodeImage(qrcodeUrl, opts.wechatQrcodeSize, logoImg);
          if (dataUrl) renderPopup(dataUrl);
        };
        logoImg.onerror = function () {
          var dataUrl = createQrcodeImage(qrcodeUrl, opts.wechatQrcodeSize);
          if (dataUrl) renderPopup(dataUrl);
        };
        logoImg.src = opts.wechatQrcodeLogo;
      } else {
        var dataUrl = createQrcodeImage(qrcodeUrl, opts.wechatQrcodeSize);
        if (dataUrl) renderPopup(dataUrl);
      }
    }).catch(function () {
      alert('二维码库加载失败');
    });
  }

  function createButton(site, opts) {
    var btn = document.createElement('a');
    btn.className = 'gw-share-icon icon-' + site;
    btn.setAttribute('aria-label', '分享到' + (names[site] || site));
    btn.title = names[site] || site;

    var iconHtml = (opts.icons && opts.icons[site]) || defaultIcons[site] || '';
    btn.innerHTML = iconHtml;

    if (site === 'poster') {
      if (!opts.posterItemId) return null;
      btn.href = 'javascript:;';

      // 如果配置了 posterLabel，整块（图标+文案）可点，对齐旧版 poster-btn-container
      if (opts.posterLabel) {
        var wrapper = document.createElement('div');
        wrapper.className = 'gw-share-poster-wrapper';
        wrapper.title = names.poster;
        wrapper.appendChild(btn);

        var label = document.createElement('span');
        label.className = 'gw-share-poster-label';
        label.textContent = opts.posterLabel;
        wrapper.appendChild(label);

        wrapper.addEventListener('click', function (e) {
          e.preventDefault();
          generatePoster(opts);
        });

        return wrapper;
      }

      btn.addEventListener('click', function (e) {
        e.preventDefault();
        generatePoster(opts);
      });
    } else if (site === 'wechat') {
      btn.href = 'javascript:;';
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        showWechatQrcode(btn, opts);
      });
    } else if (site === 'copy') {
      btn.href = 'javascript:;';
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        // 复制可用「标题 + 链接」文案，与社交分享 URL 分离
        copyText(opts.copyText || opts.url);
      });
    } else if (site === 'more') {
      if (!navigator.share) return null;
      btn.href = 'javascript:;';
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        nativeShare(opts);
      });
    } else {
      var tpl = templates[site];
      if (!tpl) return null;
      btn.href = renderUrl(tpl, opts);
      btn.target = '_blank';
      btn.rel = 'noopener noreferrer';
    }

    return btn;
  }

  function init(containerSelector, options) {
    var opts = Object.assign({}, {
      url: location.href,
      copyText: null,
      title: document.title,
      description: '',
      source: location.hostname,
      image: '',
      sites: ['weibo', 'qq', 'wechat', 'qzone'],
      wechatQrcodeSize: 120,
      wechatQrcodeUrl: null,
      wechatQrcodeLogo: null,
      posterItemId: null,
      posterWebsiteId: null,
      posterUrl: null,
      posterLabel: null,
      icons: null,
      nativeShare: false
    }, options);

    // 确保社交/微信/海报用的是合法 URL（防止误传标题+链接）
    opts.url = resolvePageUrl(opts.url);
    if (opts.posterUrl) {
      opts.posterUrl = resolvePageUrl(opts.posterUrl);
    }

    var container = typeof containerSelector === 'string'
      ? document.querySelector(containerSelector)
      : containerSelector;

    if (!container) {
      console.warn('GwShare: container not found', containerSelector);
      return;
    }

    container.classList.add('gw-share');

    opts.sites.forEach(function (site) {
      var btn = createButton(site, opts);
      if (btn) {
        container.appendChild(btn);
      }
    });

    // 如果开启原生分享且当前环境支持，自动追加"更多"按钮
    if (opts.nativeShare && navigator.share && opts.sites.indexOf('more') === -1) {
      var moreBtn = createButton('more', opts);
      if (moreBtn) container.appendChild(moreBtn);
    }
  }

  return {
    init: init,
    templates: templates,
    names: names,
    defaultIcons: defaultIcons,
    copyText: copyText
  };
});

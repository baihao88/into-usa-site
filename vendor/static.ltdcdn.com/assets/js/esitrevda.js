(function() {
	// 添加样式
	function setStyles(el, styles) {
		if (!styles) return
		var stylesKeys = Object.keys(styles)
		if (stylesKeys.length) {
			stylesKeys.forEach(function(item) {
				el.style[item] = styles[item]
			})
		}
	}
	// 添加class类名
	function addClass(el, cls) {
		if (!cls || !(cls = cls.trim())) {
			return
		}
		/* istanbul ignore else */
		if (el.classList) {
			if (cls.indexOf(' ') > -1) {
				cls.split(whitespaceRE).forEach(function(c) {
					return el.classList.add(c)
				})
			} else {
				el.classList.add(cls)
			}
		} else {
			var cur = ' ' + (el.getAttribute('class') || '') + ' '
			if (cur.indexOf(' ' + cls + ' ') < 0) {
				el.setAttribute('class', (cur + cls).trim())
			}
		}
	}
	let configUrl = window.location.protocol + '//' + location.host
	let event_url = 'https://wei.ltd.com'

	let advertise_list = []
	advertiseApi()

	// 区分移动还是pc
	function isMobile() {
		return (/phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone|webOS|android/i
			.test(navigator.userAgent))
	}

	// 判断是否微信小程序环境
	function isWechatMiniProgram() {
		// 方式1: 微信浏览器暴露的环境变量
		if (window.__wxjs_environment === 'miniprogram') return true
		// 方式2: userAgent 匹配
		if (/miniProgram/i.test(navigator.userAgent)) return true
		return false
	}

	// 数据
	function advertiseApi() {
		let homeSubsidy = {
			httpUrl: configUrl + '/shop/frontend/getEsitrevment',
			type: 'get',
			data: {
				terminal: isWechatMiniProgram() ? 3 : (isMobile() ? 2 : 1),
				page: isWechatMiniProgram() ? 'wxapp' : window.location.href
			},
			token: localStorage.getItem('GwShopUserToken') ? localStorage.getItem('GwShopUserToken') : ''
		}
		httpRequest(homeSubsidy, function(respondDada) {
			// 这里编写成功的回调函数
			let res = JSON.parse(respondDada)
			if (JSON.parse(respondDada).code == 0) {
				for (let key in res.data) {
					if (Object.keys(res.data[key]).length > 0) {
						res.data[key].class_name = key
						advertise_list.push(res.data[key])
					}
				}

				// 创建需要的标签
				var advertise = document.createElement('div')
				var img = ""
				var bot_dom
				var middle_dom
				var middle_fa
				var middle_close
				var left_dom
				var left_fa
				var left_close
				var right_dom
				var right_fa
				var right_close
				for (var i = 0; i < advertise_list.length; i++) { // 底部广告
					if (advertise_list[i].class_name == 'bot') {
						bot_dom = document.createElement('img')
						bot_dom.src = advertise_list[i].thumbnail.url
						bot_dom.setAttribute('link', advertise_list[i].link)
						bot_dom.setAttribute('title', advertise_list[i].title)
						bot_dom.setAttribute('ad_id', advertise_list[i].id)
						bot_dom.setAttribute('type', advertise_list[i].class_name)
						addClass(bot_dom, 'img_dom')
					} else if (advertise_list[i].class_name == 'middle') { // 剧中广告
						middle_dom = document.createElement('img')
						middle_dom.src = advertise_list[i].thumbnail.url
						middle_dom.setAttribute('link', advertise_list[i].link)
						middle_dom.setAttribute('ad_id', advertise_list[i].id)
						middle_dom.setAttribute('title', advertise_list[i].title)
						middle_dom.setAttribute('type', advertise_list[i].class_name)
						middle_fa = document.createElement('div')
						addClass(middle_dom, 'img_dom')
						addClass(middle_fa, 'middle_fa')
						setStyles(middle_fa, {
							'position': 'relative',
							'max-width': '80%',
							'text-align': 'center',
						})
						middle_close = document.createElement('img')
						middle_close.src =
							'https://static.xcx.gw66.vip/uploadfile/image/0/0/0/2022-03/16461192801861.png'
						addClass(middle_close, 'middle_close')
						setStyles(middle_close, {
							'position': 'absolute',
							'right': '-30px',
							'top': '-30px',
							'height': '30px',
							'width': '30px',
						})
						setStyles(middle_dom, {
							'max-width': '100%',
							'border-radius': '4px',
							'cursor': 'pointer'
						})
						if (!getCookie('middle_ad_time')) {
							if (isMobile()) {
								document.body.style.overflow = 'hidden'; //手机版设置这个。
							} else {
								document.documentElement.style.overflow = 'hidden';
							}
						}
					} else if (advertise_list[i].class_name == 'left') { // 左边
						left_dom = document.createElement('img')
						left_dom.src = advertise_list[i].thumbnail.url
						left_dom.setAttribute('link', advertise_list[i].link)
						left_dom.setAttribute('title', advertise_list[i].title)
						left_dom.setAttribute('ad_id', advertise_list[i].id)
						left_dom.setAttribute('type', advertise_list[i].class_name)
						left_fa = document.createElement('div')
						left_close = document.createElement('img')
						left_close.src =
							'https://static.xcx.gw66.vip/uploadfile/image/0/0/0/2022-03/16461192801861.png'
						addClass(left_dom, 'left')
						addClass(left_dom, 'img_dom')
						addClass(left_fa, 'left_fa')
						addClass(left_close, 'left_close')
						setStyles(left_fa, {
							'position': 'relative',
							'cursor': 'pointer'
						})
						left_fa.append(left_close)
						left_fa.append(left_dom)
						setStyles(left_close, {
							'position': 'absolute',
							'right': '-30px',
							'top': '-30px',
							'height': '30px',
							'width': '30px',
						})
					} else if (advertise_list[i].class_name == 'right') { // 右边
						right_dom = document.createElement('img')
						right_dom.src = advertise_list[i].thumbnail.url
						right_dom.setAttribute('link', advertise_list[i].link)
						right_dom.setAttribute('title', advertise_list[i].title)
						right_dom.setAttribute('ad_id', advertise_list[i].id)
						right_dom.setAttribute('type', advertise_list[i].class_name)
						right_fa = document.createElement('div')
						right_close = document.createElement('img')
						right_close.src =
							'https://static.xcx.gw66.vip/uploadfile/image/0/0/0/2022-03/16461192801861.png'
						addClass(right_dom, 'right')
						addClass(right_dom, 'img_dom')
						addClass(right_fa, 'right_fa')
						addClass(right_close, 'right_close')
						setStyles(right_fa, {
							'position': 'relative',
							'cursor': 'pointer'
						})
						right_fa.append(right_close)
						right_fa.append(right_dom)
						setStyles(right_close, {
							'position': 'absolute',
							'left': '-30px',
							'top': '-30px',
							'height': '30px',
							'width': '30px',
						})
					} else { // 其他位置
						img += '<img src="' + advertise_list[i]
							.thumbnail.url + '" ad_id="' + advertise_list[i].id + '"  title="' +
							advertise_list[i].title + '" type="' + advertise_list[i].class_name +
							'"  link="' + advertise_list[i].link + '" class="img_dom ' + advertise_list[i]
							.class_name + '" >'
					}
				}

				if (middle_close) {
					middle_close.addEventListener('click', function() {
						if (isMobile()) {
							document.body.style.overflow = 'auto'; //手机版设置这个。
						} else {
							document.documentElement.style.overflow = 'auto';
						}
						setStyles(a_box, {
							'display': 'none'
						})
						if (!isWechatMiniProgram()) {
							setCookie('middle_ad_time', 1)
						}
					})
				}


				// 添加class类名
				addClass(advertise, 'advertise')
				if (bot_dom) {
					bot_close = document.createElement('img')
					bot_close.src =
						'https://static.xcx.gw66.vip/uploadfile/image/0/0/0/2022-03/16461192801861.png'
					bot_fa = document.createElement('div')
					// 添加class类名
					addClass(bot_fa, 'bot')
					// addClass(bot_dom, 'bot')
					// 组合标签
					bot_fa.append(bot_close)
					bot_fa.append(bot_dom)
					window.document.body.append(bot_fa)
					// 添加样式
					setStyles(bot_fa, {
						'position': 'fixed',
						'bottom': '0',
						'z-index': '999',
						'max-width': '100%',
						'cursor': 'pointer',
            'width': '100%'
					})
					setStyles(bot_dom, {
						'width': '100%'
					})
					setStyles(bot_close, {
						'position': 'absolute',
						'right': '10px',
						'top': '10px',
						'height': '30px',
						'width': '30px',
					})
					
					bot_close.addEventListener('click', function() {
						setStyles(bot_fa, {
							'display': 'none'
						})
					})
					
				}
				if (middle_dom && !getCookie('middle_ad_time')) {
					var a_box = document.createElement('div')
					// 添加class类名
					addClass(a_box, 'a_box')
					// 添加样式
					setStyles(a_box, {
						'position': 'fixed',
						'left': '50%',
						'top': '50%',
						'transform': 'translate(-50%, -50%)',
						'display': 'flex',
						'align-items': 'flex-end',
						'flex-direction': 'column',
						'max-width': '100%',
						'z-index': '999',
						'height': '100%',
						'width': '100%',
						'display': 'flex',
						'align-items': 'center',
						'justify-content': 'center',
						'background': 'rgba(0,0,0,0.5)',
					})
					// 添加class类名
					addClass(middle_dom, 'middle')
					// 组合标签
					middle_fa.append(middle_close)
					middle_fa.append(middle_dom)
					a_box.append(middle_fa)
					window.document.body.append(a_box)
				}

				let esitrevda_dom = document.getElementById("esitrevda_dom")

				// 组合标签
				advertise.innerHTML = img
				esitrevda_dom.append(advertise)

				// var right = document.getElementsByClassName('right')[0]
				// var left = document.getElementsByClassName('left')[0]
				var top = document.getElementsByClassName('top')[0]
				if (right_fa && !getCookie('right_ad_time')) {
					var right = document.createElement('div')
					// 添加class类名
					addClass(right, 'right_box')
					right.append(right_fa)
					setStyles(right, {
						'position': 'fixed',
						'right': '0',
						'top': '50%',
						'transform': 'translateY(-50%)',
						'z-index': '99',
						'max-height': '100%'
					})
					right_close.addEventListener('click', function() {
						setCookie('right_ad_time', 1)
						setStyles(right, {
							'display': 'none'
						})
					})
					window.document.body.append(right)
				}

				if (left_fa && !getCookie('left_ad_time')) {
					// advertise.append(left_fa)
					var left = document.createElement('div')
					// 添加class类名
					addClass(left, 'left_box')
					left.append(left_fa)
					setStyles(left, {
						'position': 'fixed',
						'left': '0',
						'top': '50%',
						'transform': 'translateY(-50%)',
						'z-index': '99',
						'max-height': '100%'
					})
					left_close.addEventListener('click', function() {
						setStyles(left, {
							'display': 'none'
						})
						setCookie('left_ad_time', 1)
					})
					window.document.body.append(left)

				}

				if (top) {
					setStyles(top, {
						'z-index': '9999',
						'max-width': '100%',
						'cursor': 'pointer'
					})
				}

				var img_dom = document.getElementsByClassName('img_dom')
				for (var i = 0; i < img_dom.length; i++) {
					img_dom[i].index = i;
					img_dom[i].onclick = function(e) {
						setCookie(`${e.target.getAttribute('type')}_ad_time`, 1)
						let homeSubsidy = {
							httpUrl: event_url + '/analyst/event',
							type: 'POST',
							data: {
								referer: window.location.href,
								type: 2,
								source: 1,
								// gmac : localStorage.getItem("__DC_STAT_UUID"),
								relative: e.target.getAttribute('title'),
								ad_id: e.target.getAttribute('ad_id'),
								dt: "pc"
							},
							token: localStorage.getItem('GwShopUserToken') ? localStorage.getItem(
								'GwShopUserToken') : ''
						}
						httpRequest(homeSubsidy, function(respondDada) {
              if(e.target.getAttribute("link")){
							  window.location.href = e.target.getAttribute("link")
              }
						}, function() {
							console.log("错咯")
						})
					}
				}

			}
		}, function() {
			// alert('网络错误')
		})
	}



	// 封装请求方法
	function httpRequest(paramObj, fun, errFun) {
		var xmlhttp = null
		// /* 创建XMLHttpRequest对象，
		//  *老版本的 Internet Explorer（IE5 和 IE6）使用 ActiveX 对象：new ActiveXObject("Microsoft.XMLHTTP")
		//  * */
		if (window.XMLHttpRequest) {
			xmlhttp = new XMLHttpRequest()
		} else if (window.ActiveXObject) {
			xmlhttp = new ActiveXObject('Microsoft.XMLHTTP')
		}
		/* 判断是否支持请求 */
		if (xmlhttp == null) {
			// alert('你的浏览器不支持XMLHttp')
			return
		}
		/* 请求方式，并且转换为大写 */
		var httpType = (paramObj.type || 'GET').toUpperCase()
		/* 数据类型 */
		var dataType = paramObj.dataType || 'json'
		/* 请求接口 */
		var httpUrl = paramObj.httpUrl || ''
		/* 是否异步请求 */
		var async = paramObj.async || true
		/* 请求参数--post请求参数格式为：foo=bar&lorem=ipsum */
		var paramData = paramObj.data || []
		var requestData = ''
		for (var name in paramData) {
			requestData += name + '=' + paramData[name] + '&'
		}
		requestData = requestData == '' ? '' : requestData.substring(0, requestData.length - 1)

		/* 请求接收 */
		xmlhttp.onreadystatechange = function() {
			if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
				/* 成功回调函数 */
				fun(xmlhttp.responseText)
			} else {
				/* 失败回调函数 */
				errFun()
			}
		}

		/* 接口连接，先判断连接类型是post还是get */
		if (httpType == 'GET') {
			httpUrl = httpUrl + "?" + requestData
			xmlhttp.open('GET', httpUrl, async)

			if (paramObj.token.length > 0) {
				xmlhttp.setRequestHeader('Gw-Shop-User-Token', paramObj.token)
			}
			xmlhttp.send(null)
		} else if (httpType == 'POST') {
			xmlhttp.open('POST', httpUrl, async)
			// 发送合适的请求头信息

			if (paramObj.token.length > 0) {
				xmlhttp.setRequestHeader('Gw-Shop-User-Token', paramObj.token)
			}
			xmlhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
			xmlhttp.send(requestData)
		}
	}

	// 写cookies
	function setCookie(name, value) {
		var exp = new Date();
		exp.setTime(exp.getTime() + 24 * 60 * 60 * 1000);
		document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
	}

	//读取cookies
	function getCookie(name) {
		var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
		if (arr = document.cookie.match(reg)) return unescape(arr[2]);
		else return null;
	}



})()

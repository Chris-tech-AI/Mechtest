/* ============================================================
   渲染与交互
   ============================================================ */
(function () {
  'use strict';

  var $  = function (s) { return document.querySelector(s); };
  var qEl       = $('#q');
  var chipsEl   = $('#chips');
  var groupsEl  = $('#groups');
  var countEl   = $('#count');
  var emptyEl   = $('#empty');
  var toastEl   = $('#toast');

  var GROUP_NAME = {};
  GROUPS.forEach(function (g) { GROUP_NAME[g.key] = g.name; });

  /* 全局序号，跨分类连续编号 01…18 */
  var CODE = {};
  ITEMS.forEach(function (it, i) { CODE[it.name] = ('0' + (i + 1)).slice(-2); });

  var state = { group: 'all', kw: '' };

  /* ---------------- 分类筛选条 ---------------- */
  function renderChips() {
    var html = '<button class="chip is-on" data-g="all">全部<b>' + ITEMS.length + '</b></button>';
    GROUPS.forEach(function (g) {
      var n = ITEMS.filter(function (it) { return it.group === g.key; }).length;
      html += '<button class="chip" data-g="' + g.key + '">' + g.name + '<b>' + n + '</b></button>';
    });
    chipsEl.innerHTML = html;

    chipsEl.addEventListener('click', function (e) {
      var btn = e.target.closest('.chip');
      if (!btn) return;
      state.group = btn.dataset.g;
      Array.prototype.forEach.call(chipsEl.children, function (c) {
        c.classList.toggle('is-on', c === btn);
      });
      render();
    });
  }

  /* ---------------- 卡片 ---------------- */
  function cardHTML(it) {
    var isSoon = !it.url;
    var svg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" ' +
              'stroke-linecap="round" stroke-linejoin="round">' + (ICONS[it.icon] || '') + '</svg>';

    return '' +
      '<a class="card' + (isSoon ? ' is-soon' : '') + '" href="' + (it.url || '#') + '"' +
        (isSoon ? '' : ' target="_blank" rel="noopener"') +
        ' data-name="' + it.name + '" data-url="' + (it.url || '') + '">' +
        '<div class="card__head">' +
          '<span class="ic">' + svg + '</span>' +
          '<span class="card__code">' + CODE[it.name] + '</span>' +
        '</div>' +
        '<h3 class="card__name">' + it.name + '</h3>' +
        '<div class="card__en">' + it.en + '</div>' +
        '<p class="card__desc">' + it.desc + '</p>' +
        '<div class="card__foot">' +
          '<span class="st">' + (isSoon ? '待接入' : '已上线 · 打开') + '</span>' +
          '<span class="arw"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
          'stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
          '<path d="M5 12h13M13.5 6.8 19 12l-5.5 5.2"/></svg></span>' +
        '</div>' +
      '</a>';
  }

  /* ---------------- 匹配 ---------------- */
  function match(it) {
    if (state.group !== 'all' && it.group !== state.group) return false;
    if (!state.kw) return true;
    var hay = (it.name + ' ' + it.en + ' ' + it.desc + ' ' + GROUP_NAME[it.group]).toLowerCase();
    return hay.indexOf(state.kw) > -1;
  }

  /* ---------------- 主渲染 ---------------- */
  function render() {
    var html = '';
    var shown = 0;

    GROUPS.forEach(function (g) {
      if (state.group !== 'all' && state.group !== g.key) return;
      var list = ITEMS.filter(function (it) { return it.group === g.key && match(it); });
      if (!list.length) return;
      shown += list.length;

      html += '<section class="group">' +
        '<h2 class="sec__title"><span class="sec__sq"></span>' + g.name +
        ' <em>' + g.en + '</em><i>' + list.length + ' 个模块</i></h2>' +
        '<div class="grid">' + list.map(cardHTML).join('') + '</div>' +
      '</section>';
    });

    groupsEl.innerHTML = html;
    emptyEl.hidden = shown > 0;
    countEl.textContent = state.kw
      ? '搜索结果 ' + shown + ' / ' + ITEMS.length + ' 个模块 · 关键词「' + state.kw + '」'
      : '共 ' + ITEMS.length + ' 个参考模块';
  }

  /* ---------------- 搜索 ---------------- */
  var timer;
  qEl.addEventListener('input', function () {
    clearTimeout(timer);
    timer = setTimeout(function () {
      state.kw = qEl.value.trim().toLowerCase();
      render();
    }, 110);
  });

  document.addEventListener('keydown', function (e) {
    var typing = /^(INPUT|TEXTAREA)$/.test(document.activeElement.tagName);
    if (e.key === '/' && !typing) {
      e.preventDefault();
      qEl.focus();
      qEl.select();
    } else if (e.key === 'Escape' && typing) {
      qEl.value = '';
      state.kw = '';
      render();
      qEl.blur();
    }
  });

  /* ---------------- 点击模块 ---------------- */
  var toastTimer;
  function toast(msg) {
    toastEl.innerHTML = msg;
    toastEl.classList.add('is-on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove('is-on'); }, 2600);
  }

  groupsEl.addEventListener('click', function (e) {
    var card = e.target.closest('.card');
    if (!card) return;
    /* 已接入的模块：放行原生跳转（target=_blank 新标签打开） */
    if (card.dataset.url) return;
    /* 未接入的模块：拦住跳转并提示 */
    e.preventDefault();
    toast('「<b>' + card.dataset.name + '</b>」页面尚未接入 · 敬请期待');
  });

  /* ---------------- 导航滚动高亮 ---------------- */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav__a'));
  var targets  = navLinks.map(function (a) { return $(a.getAttribute('href')); });
  window.addEventListener('scroll', function () {
    var y = window.scrollY + 120, idx = 0;
    targets.forEach(function (t, i) { if (t && t.offsetTop <= y) idx = i; });
    navLinks.forEach(function (a, i) { a.classList.toggle('is-on', i === idx); });
  }, { passive: true });

  /* ---------------- 启动 ---------------- */
  var liveN = ITEMS.filter(function (it) { return !!it.url; }).length;
  $('#statTotal').textContent = ITEMS.length;
  $('#statCats').textContent  = GROUPS.length;
  $('#statLive').textContent  = liveN;
  $('#tagLine').textContent   = VERSION + ' · 已接入 ' + liveN + ' / ' + ITEMS.length;
  $('#footVer').textContent   = VERSION;
  renderChips();
  render();
})();

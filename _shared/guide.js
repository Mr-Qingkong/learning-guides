/* 学习指南合集 · 共享交互脚本
   功能：自动目录侧边栏 / 滚动高亮 / 移动端抽屉 / 示意图放大 / 复制按钮 / 练习清单进度 / 阅读进度条 */
(function () {
  var d = document;

  /* ---------- 指南总目录（上一篇 / 下一篇 数据源）---------- */
  var GUIDE_CATALOG = [
    { f: '01-prompt-engineering.html', t: 'AI 提示词工程进阶指南' },
    { f: '02-python-basics.html', t: 'Python 编程进阶指南' },
    { f: '03-data-analysis.html', t: '数据分析进阶指南' },
    { f: '04-effective-writing.html', t: '高效写作进阶指南' },
    { f: '05-learning-methods.html', t: '高效学习法进阶指南' },
    { f: '06-time-management.html', t: '时间管理进阶指南' },
    { f: '07-personal-finance.html', t: '个人理财进阶指南' },
    { f: '08-english-learning.html', t: '英语学习进阶指南' },
    { f: '09-critical-thinking.html', t: '批判性思维进阶指南' },
    { f: '10-sleep-energy.html', t: '睡眠与精力管理进阶指南' },
    { f: '11-astronomy.html', t: '天文学进阶指南' },
    { f: '12-geography.html', t: '地理学进阶指南' },
    { f: '13-history.html', t: '世界历史脉络进阶指南' },
    { f: '14-politics.html', t: '政治学基础进阶指南' },
    { f: '15-i-ching.html', t: '易经与阴阳五行进阶指南' },
    { f: '16-biology.html', t: '生物学进阶指南' },
    { f: '17-chemistry.html', t: '化学进阶指南' },
    { f: '18-physics.html', t: '物理与机械进阶指南' },
    { f: '19-machine-learning.html', t: '机器学习入门进阶指南' },
    { f: '20-llm-apps.html', t: '大模型应用与智能体指南' },
    { f: '21-linux-cli.html', t: 'Linux 与命令行进阶指南' },
    { f: '22-git.html', t: 'Git 与版本控制指南' },
    { f: '23-sql.html', t: 'SQL 与数据查询指南' },
    { f: '24-algorithms.html', t: '算法与数据结构指南' },
    { f: '25-networking.html', t: '计算机网络基础指南' },
    { f: '26-info-security.html', t: '信息安全常识指南' },
    { f: '27-public-speaking.html', t: '演讲与口头表达指南' },
    { f: '28-reading-methods.html', t: '深度阅读方法指南' },
    { f: '29-note-taking.html', t: '笔记与知识管理指南' },
    { f: '30-memory.html', t: '记忆术进阶指南' },
    { f: '31-exercise.html', t: '运动科学指南' },
    { f: '32-nutrition.html', t: '饮食营养指南' },
    { f: '33-emotion.html', t: '情绪与压力管理指南' },
    { f: '34-habits.html', t: '习惯养成指南' },
    { f: '35-communication.html', t: '人际沟通指南' },
    { f: '36-negotiation.html', t: '谈判技巧指南' },
    { f: '37-job-interview.html', t: '求职与面试指南' },
    { f: '38-career.html', t: '职业规划指南' },
    { f: '39-economics.html', t: '经济学思维指南' },
    { f: '40-psychology.html', t: '心理学导论指南' },
    { f: '41-philosophy.html', t: '哲学导论指南' },
    { f: '42-sociology.html', t: '社会学视角指南' },
    { f: '43-law.html', t: '法律常识指南' },
    { f: '44-education.html', t: '教育学基础指南' },
    { f: '45-math.html', t: '数学思维指南' },
    { f: '46-statistics.html', t: '统计学入门指南' },
    { f: '47-medicine.html', t: '人体与医学常识指南' },
    { f: '48-neuroscience.html', t: '大脑与神经科学指南' },
    { f: '49-ecology.html', t: '生态与环境指南' },
    { f: '50-scientific-method.html', t: '科学方法论指南' },
    { f: '51-music.html', t: '音乐欣赏指南' },
    { f: '52-painting.html', t: '美术与绘画指南' },
    { f: '53-film.html', t: '电影鉴赏指南' },
    { f: '54-photography.html', t: '摄影入门指南' },
    { f: '55-architecture.html', t: '建筑欣赏指南' },
    { f: '56-literature.html', t: '文学导论指南' },
    { f: '57-religion.html', t: '世界宗教概览指南' },
    { f: '58-calligraphy.html', t: '书法入门指南' }
  ];

  /* ---------- 顶部阅读进度条 ---------- */
  var readbar = d.createElement('div');
  readbar.id = 'readbar';
  d.body.appendChild(readbar);
  function updateBar() {
    var h = d.documentElement;
    var max = h.scrollHeight - h.clientHeight;
    var p = max > 0 ? (h.scrollTop / max) * 100 : 0;
    readbar.style.width = Math.min(100, Math.max(0, p)) + '%';
  }
  window.addEventListener('scroll', function () { requestAnimationFrame(updateBar); }, { passive: true });
  window.addEventListener('resize', updateBar);
  updateBar();

  /* ---------- 复制按钮 ---------- */
  var copyBtns = d.querySelectorAll('.copy-btn');
  copyBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var block = btn.closest('.prompt-block');
      var clone = block.cloneNode(true);
      var label = clone.querySelector('.prompt-label');
      var btnEl = clone.querySelector('.copy-btn');
      if (label) label.remove();
      if (btnEl) btnEl.remove();
      var text = clone.textContent.trim();
      var done = function () {
        btn.textContent = '已复制';
        btn.classList.add('copied');
        setTimeout(function () { btn.textContent = '复制'; btn.classList.remove('copied'); }, 1500);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done).catch(function () { fallbackCopy(text); done(); });
      } else {
        fallbackCopy(text); done();
      }
    });
  });
  function fallbackCopy(text) {
    var ta = d.createElement('textarea');
    ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
    d.body.appendChild(ta); ta.select();
    try { d.execCommand('copy'); } catch (e) {}
    d.body.removeChild(ta);
  }

  /* ---------- 练习清单进度条 ---------- */
  var items = d.querySelectorAll('.check-item');
  if (items.length) {
    var fill = d.getElementById('progressFill');
    var txt = d.getElementById('progressText');
    function update() {
      var done = 0;
      items.forEach(function (it) {
        var cb = it.querySelector('input[type=checkbox]');
        if (cb.checked) { it.classList.add('checked'); done++; }
        else { it.classList.remove('checked'); }
      });
      var pct = items.length ? Math.round((done / items.length) * 100) : 0;
      if (fill) fill.style.width = pct + '%';
      if (txt) txt.textContent = done + ' / ' + items.length;
    }
    items.forEach(function (it) {
      it.addEventListener('click', function (e) {
        if (e.target.tagName !== 'INPUT') {
          var cb = it.querySelector('input[type=checkbox]');
          cb.checked = !cb.checked;
        }
        update();
      });
    });
    update();
  }

  /* ---------- 自动生成左侧目录侧边栏 ---------- */
  var noSidebar = d.body.getAttribute('data-sidebar') === 'off';
  var secs = [].slice.call(d.querySelectorAll('main section')).filter(function (s) {
    return s.querySelector('h2');
  });

  if (!noSidebar && secs.length >= 3) {
    d.body.classList.add('has-sidebar');

    // 为无 id 的章节分配锚点
    secs.forEach(function (s, i) {
      if (!s.id) s.id = 'sec-' + (i + 1);
    });

    // 品牌区标题
    var h1 = d.querySelector('.report-intro h1');
    var brandTitle = h1 ? h1.textContent.trim() : d.title;

    // 组装侧边栏 DOM
    var aside = d.createElement('aside');
    aside.className = 'sidebar';
    aside.id = 'sidebar';
    aside.innerHTML =
      '<div class="sidebar__brand">' +
        '<span class="dot">学</span>' +
        '<div><div class="bt"></div><div class="bs">学习指南合集</div></div>' +
      '</div>' +
      '<div class="toc-label">本页目录</div>' +
      '<ul id="tocList"></ul>' +
      '<div class="sidebar__foot">滚动时目录自动高亮当前小节<br>点击目录可快速定位</div>';
    aside.querySelector('.bt').textContent = brandTitle;

    var ul = aside.querySelector('#tocList');
    secs.forEach(function (s, i) {
      var h2 = s.querySelector('h2').cloneNode(true);
      var numEl = h2.querySelector('.sec-num');
      var numTxt = numEl ? numEl.textContent : (i + 1 < 10 ? '0' + (i + 1) : '' + (i + 1));
      if (numEl) numEl.remove();
      var label = h2.textContent.trim().replace(/\s+/g, '');
      if (label.length > 12) label = label.slice(0, 12) + '…';
      var li = d.createElement('li');
      li.innerHTML = '<a href="#' + s.id + '"><span class="n">' + numTxt + '</span><span class="t"></span></a>';
      li.querySelector('.t').textContent = label;
      ul.appendChild(li);
    });

    var toggle = d.createElement('button');
    toggle.className = 'sidebar-toggle';
    toggle.id = 'navToggle';
    toggle.setAttribute('aria-label', '打开目录');
    toggle.innerHTML = '<span></span>';
    var scrim = d.createElement('div');
    scrim.className = 'sidebar-scrim';
    scrim.id = 'navScrim';

    d.body.appendChild(toggle);
    d.body.appendChild(scrim);
    d.body.appendChild(aside);

    /* ----- 滚动高亮（scroll-spy）----- */
    var links = [].slice.call(ul.querySelectorAll('a'));
    var anchors = links.map(function (a) {
      return d.getElementById(a.getAttribute('href').slice(1));
    });
    function setActive(i) {
      links.forEach(function (a, j) { a.classList.toggle('active', j === i); });
    }
    function onScroll() {
      var pos = window.scrollY || d.documentElement.scrollTop;
      var probe = pos + 140;
      var idx = 0;
      for (var i = 0; i < anchors.length; i++) {
        if (anchors[i] && anchors[i].offsetTop <= probe) idx = i;
      }
      if (pos + window.innerHeight >= d.documentElement.scrollHeight - 4) idx = anchors.length - 1;
      setActive(idx);
    }
    var ticking = false;
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; requestAnimationFrame(function () { onScroll(); ticking = false; }); }
    }, { passive: true });
    window.addEventListener('resize', onScroll);
    onScroll();

    /* ----- 移动端抽屉 ----- */
    var body = d.body;
    function closeNav() { body.classList.remove('nav-open'); }
    toggle.addEventListener('click', function () { body.classList.toggle('nav-open'); });
    scrim.addEventListener('click', closeNav);
    links.forEach(function (a) {
      a.addEventListener('click', function () { if (window.innerWidth < 1180) closeNav(); });
    });
    d.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeNav(); });
  }

  /* ---------- 上一篇 / 下一篇切换 ---------- */
  (function () {
    var here = decodeURIComponent((location.pathname.split('/').pop() || '')) || 'index.html';
    var idx = -1;
    for (var i = 0; i < GUIDE_CATALOG.length; i++) {
      if (GUIDE_CATALOG[i].f === here) { idx = i; break; }
    }
    if (idx < 0) return;
    var main = d.querySelector('main');
    if (!main) return;
    var prev = idx > 0 ? GUIDE_CATALOG[idx - 1] : null;
    var next = idx < GUIDE_CATALOG.length - 1 ? GUIDE_CATALOG[idx + 1] : null;
    var nav = d.createElement('div');
    nav.className = 'guide-nav';
    nav.innerHTML =
      (prev
        ? '<a class="gn-prev" href="' + prev.f + '"><span>上一篇</span><b>' + prev.t + '</b></a>'
        : '<a class="gn-prev" href="index.html"><span>返回</span><b>全部指南目录</b></a>') +
      (next
        ? '<a class="gn-next" href="' + next.f + '"><span>下一篇</span><b>' + next.t + '</b></a>'
        : '<a class="gn-next" href="index.html"><span>返回</span><b>全部指南目录</b></a>');
    main.appendChild(nav);
  })();

  /* ---------- 示意图 / 图片点击放大（lightbox）---------- */
  var lb = null;
  function ensureLb() {
    if (lb) return lb;
    lb = d.createElement('div');
    lb.className = 'lb-overlay';
    lb.innerHTML = '<div class="lb-close" title="关闭">×</div><div class="lb-stage"></div><div class="lb-cap"></div>';
    d.body.appendChild(lb);
    lb.addEventListener('click', function (e) {
      if (e.target === lb || e.target.classList.contains('lb-close') || e.target.classList.contains('lb-stage')) {
        lb.classList.remove('open');
        d.body.style.overflow = '';
      }
    });
    d.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && lb.classList.contains('open')) {
        lb.classList.remove('open');
        d.body.style.overflow = '';
      }
    });
    return lb;
  }
  function openLb(node, cap) {
    var overlay = ensureLb();
    var stage = overlay.querySelector('.lb-stage');
    stage.innerHTML = '';
    var clone = node.cloneNode(true);
    if (clone.tagName === 'svg' || clone.tagName === 'SVG') {
      clone.setAttribute('width', '');
      clone.setAttribute('height', '');
      clone.style.width = 'min(1080px, 92vw)';
      clone.style.height = 'auto';
      clone.style.maxHeight = '82vh';
    } else {
      clone.style.maxWidth = '92vw';
      clone.style.maxHeight = '82vh';
    }
    stage.appendChild(clone);
    overlay.querySelector('.lb-cap').textContent = cap || '';
    overlay.classList.add('open');
    d.body.style.overflow = 'hidden';
  }
  // SVG 示意图（.figure 内）
  [].slice.call(d.querySelectorAll('.figure')).forEach(function (fig) {
    var svg = fig.querySelector('svg');
    if (!svg) return;
    var cap = fig.querySelector('.fig-caption');
    fig.addEventListener('click', function () {
      openLb(svg, cap ? cap.textContent.trim() : '');
    });
  });
  // 真实图片（figure img）
  [].slice.call(d.querySelectorAll('figure img')).forEach(function (img) {
    var fig = img.closest('figure');
    var cap = fig ? (fig.querySelector('figcaption') || fig.querySelector('.fig-caption')) : null;
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', function () {
      openLb(img, cap ? cap.textContent.trim() : '');
    });
  });
})();

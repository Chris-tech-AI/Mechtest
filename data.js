/* ============================================================
   模块数据 —— 唯一需要维护的文件
   新增 / 修改模块，只改这里即可。

   items 字段说明：
     name  模块名（分类名，来自 类别.xlsx）
     en    英文名 / 说明性副标题
     desc  一句话功能描述
     group 所属分类 key
     icon  图标 key（见 ICONS）
     url   目标地址 —— 留空 "" 表示「待接入」，填上路径即自动变为「已上线」可点击
           推荐写相对路径（相对本文件所在的 0-主页面/），
           这样整个「AI工作库」目录整体搬迁或换盘符都不会断链。
   ============================================================ */

/* ============================================================
   版本号 —— 顶栏与页脚共用，改一处即可
   ============================================================ */
var VERSION = 'v0.2';

var GROUPS = [
  { key: 'general',  name: '通用工具',       en: 'GENERAL' },
  { key: 'drive',    name: '传动件',         en: 'TRANSMISSION' },
  { key: 'power',    name: '动力与流体',     en: 'POWER & FLUID' },
  { key: 'material', name: '材料与标准件',   en: 'MATERIAL & STANDARD' }
];

var ITEMS = [
  /* ---------- 通用工具 ---------- */
  { name: '单位换算', en: 'Unit Converter',      group: 'general',  icon: 'convert',
    desc: '常用工程单位与量纲互换，覆盖力、压力、长度、扭矩等。', url: '' },
  { name: '公差配合', en: 'Tolerance & Fit',     group: 'general',  icon: 'tolerance',
    desc: 'GB/T 1800 极限偏差查询，孔轴配合性质与间隙量速算。',
    url: '1-tolerance-fit/index.html' },

  /* ---------- 传动件 ---------- */
  { name: '带传动',   en: 'Belt Drive',          group: 'drive',    icon: 'belt',
    desc: '带型选择、中心距与包角计算，带轮基准直径匹配。', url: '' },
  { name: '链传动',   en: 'Chain Drive',         group: 'drive',    icon: 'chain',
    desc: '链条规格、节数与中心距设计，链轮齿数校核。', url: '' },
  { name: '齿轮传动', en: 'Gear Drive',          group: 'drive',    icon: 'gear',
    desc: '模数、齿数、变位与强度校核，传动比分配。', url: '' },
  { name: '蜗杆',     en: 'Worm Drive',          group: 'drive',    icon: 'worm',
    desc: '蜗杆蜗轮传动比、效率与自锁条件计算。', url: '' },
  { name: '丝杆传动', en: 'Lead Screw',          group: 'drive',    icon: 'leadscrew',
    desc: '导程、推力与临界转速校核，直线运动选型。', url: '' },
  { name: '凸轮',     en: 'Cam Mechanism',       group: 'drive',    icon: 'cam',
    desc: '从动件运动规律选择与凸轮轮廓设计要点。', url: '' },

  /* ---------- 动力与流体 ---------- */
  { name: '电机',     en: 'Motor & Drive',       group: 'power',    icon: 'motor',
    desc: '功率、转矩、转速换算，常用电机选型参数速查。', url: '' },
  { name: '气动设计', en: 'Pneumatics',          group: 'power',    icon: 'pneumatic',
    desc: '气缸缸径与耗气量计算，气动回路元件选型。', url: '' },
  { name: '液压系统', en: 'Hydraulics',          group: 'power',    icon: 'hydraulic',
    desc: '压力、流量与缸径匹配，液压泵与阀件选型。', url: '' },

  /* ---------- 材料与标准件 ---------- */
  { name: '材料',     en: 'Materials',           group: 'material', icon: 'material',
    desc: '常用金属与非金属牌号、力学性能与热处理参考。', url: '' },
  { name: '力学性能', en: 'Mechanical Properties', group: 'material', icon: 'curve',
    desc: '强度、刚度与应力应变数据，安全系数取值参考。', url: '' },
  { name: '标准件',   en: 'Standard Parts',      group: 'material', icon: 'bolt',
    desc: '螺栓、螺母、垫圈、挡圈等常用规格库与标记。', url: '' },
  { name: '键&销',    en: 'Keys & Pins',         group: 'material', icon: 'key',
    desc: '平键、花键与销连接的规格及强度校核。', url: '' },
  { name: '螺纹',     en: 'Threads',             group: 'material', icon: 'thread',
    desc: '公制螺纹规格、旋合长度与紧固扭矩参考。', url: '' },
  { name: '弹簧',     en: 'Springs',             group: 'material', icon: 'spring',
    desc: '圆柱螺旋压缩 / 拉伸弹簧的设计与校核。', url: '' },
  { name: '轴承',     en: 'Bearings',            group: 'material', icon: 'bearing',
    desc: '型号查询、载荷与寿命计算，配合公差建议。', url: '' }
];

/* ============================================================
   图标（24×24 线性图标，描边继承 currentColor）
   ============================================================ */
var ICONS = {
  convert:   '<circle cx="6.5" cy="12" r="3.2"/><circle cx="17.5" cy="12" r="3.2"/><path d="M6.5 8.8h11M6.5 15.2h11"/>',
  tolerance: '<path d="M5 6v12M19 6v12"/><path d="M5 12h14"/><path d="M7.6 10.2 5.4 12l2.2 1.8M16.4 10.2l2.2 1.8-2.2 1.8"/>',
  belt:      '<circle cx="6.5" cy="12" r="3.4"/><circle cx="17.5" cy="12" r="3.4"/><path d="M6.5 8.6h11M6.5 15.4h11"/><path d="M6.5 12h1.6M15.9 12h1.6"/>',
  chain:     '<circle cx="6" cy="12" r="3"/><circle cx="18" cy="12" r="3"/><path d="M6 9h12M6 15h12" stroke-dasharray="2 2.2"/>',
  gear:      '<circle cx="12" cy="12" r="6.4"/><circle cx="12" cy="12" r="2.5"/><path d="M12 2.6v3M12 18.4v3M2.6 12h3M18.4 12h3M5.4 5.4l2.1 2.1M16.5 16.5l2.1 2.1M18.6 5.4l-2.1 2.1M7.5 16.5l-2.1 2.1"/>',
  worm:      '<path d="M2 11h12.5"/><path d="M4 8.6 6 11l-2 2.4M8.5 8.6l2 2.4-2 2.4"/><circle cx="18" cy="11" r="4.4"/><circle cx="18" cy="11" r="1.4"/>',
  leadscrew: '<path d="M2 12h20"/><path d="M6.5 8.6 9 12l-2.5 3.4M11.5 8.6 14 12l-2.5 3.4M16.5 8.6 19 12l-2.5 3.4"/>',
  cam:       '<circle cx="12" cy="15" r="6"/><circle cx="10" cy="15" r="1.3"/><path d="M12 9V4M10.4 5.6 12 4l1.6 1.6"/>',
  motor:     '<circle cx="12" cy="12" r="7.5"/><path d="M9.4 15 12 8.2l2.6 6.8M10.3 13h3.4"/><path d="M12 4.5V2.6M12 21.4v-1.9"/>',
  pneumatic: '<rect x="3" y="8" width="12" height="8" rx="1.6"/><path d="M9 8v8M15 12h6"/><path d="M5 12h2.6M6.8 10.9 8 12l-1.2 1.1"/>',
  hydraulic: '<rect x="2.5" y="9" width="12" height="8" rx="2"/><path d="M7.5 9.4v7.2M14.5 13h4.5"/><circle cx="19" cy="7.2" r="2.6"/><path d="M19 5.6v1.6l1 1"/>',
  material:  '<path d="M12 3 20.5 7.3v9.4L12 21l-8.5-4.3V7.3z"/><path d="M3.5 7.3 12 11.7l8.5-4.4M12 11.7V21"/>',
  curve:     '<path d="M4 4.5v15h16"/><path d="M5.5 19 9 12l3.5 3L18.5 7"/>',
  bolt:      '<path d="M9 3.5h6l3 4.5-3 4.5H9L6 8z"/><path d="M12 12.5V21"/><path d="M9.6 15.4h4.8M9.6 18.2h4.8"/>',
  key:       '<rect x="2.8" y="9" width="10.4" height="6" rx="1"/><circle cx="18" cy="12" r="3.2"/><path d="M13.2 12h1.6"/>',
  thread:    '<rect x="3" y="6.5" width="18" height="11" rx="1.2"/><path d="M6.6 6.5 9.4 17.5M11.2 6.5l2.8 11M15.8 6.5l2.8 11"/>',
  spring:    '<path d="M5 4.6h14M5 19.4h14"/><path d="M7 4.6 17 7.6 7 10.6 17 13.6 7 16.6 17 19.4"/>',
  bearing:   '<circle cx="12" cy="12" r="8.8"/><circle cx="12" cy="12" r="4.4"/><circle cx="12" cy="6.3" r="1.3"/><circle cx="12" cy="17.7" r="1.3"/><circle cx="6.3" cy="12" r="1.3"/><circle cx="17.7" cy="12" r="1.3"/>'
};

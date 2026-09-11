/* ===================================================================
 * 公差数据 (基于 GB/T 1800.1-2009 / ISO 286-1)
 * STANDARD_TOLERANCES: 标准公差 IT01-IT18 (μm)
 * DEVIATION_DATA: 基本偏差 (μm)
 * =================================================================== */

// 标准公差 IT01-IT18, 索引 1-18 对应等级 01, 0, 1, 2, ..., 18
// 每个数组 12 个值对应 12 个尺寸段 (≤3, ≤6, ≤10, ≤18, ≤30, ≤50, ≤80, ≤120, ≤180, ≤250, ≤315, ≤500)
const STANDARD_TOLERANCES = {
    1:  [0.3,  0.4,  0.5,  0.6,  0.7,  0.8,  0.9,  1.0,  1.2,  1.4,  1.6,  2.0  ],
    2:  [0.5,  0.6,  0.7,  0.8,  1.0,  1.2,  1.4,  1.6,  2.0,  2.4,  2.8,  3.4  ],
    3:  [0.8,  1.0,  1.2,  1.4,  1.8,  2.2,  2.6,  3.2,  4.0,  4.8,  5.6,  6.8  ],
    4:  [1.2,  1.5,  1.8,  2.2,  2.8,  3.4,  4.0,  5.0,  6.0,  7.0,  8.0,  9.5  ],
    5:  [2.0,  2.5,  3.0,  3.5,  4.0,  4.5,  5.0,  6.0,  7.0,  8.0,  9.0,  10.0 ],
    6:  [3.0,  4.0,  5.0,  6.0,  7.0,  8.0,  9.0,  10.0, 12.0, 14.0, 16.0, 18.0 ],
    7:  [4.0,  5.0,  6.0,  8.0,  9.0,  11.0, 13.0, 15.0, 18.0, 20.0, 23.0, 25.0 ],
    8:  [6.0,  7.0,  9.0,  11.0, 13.0, 16.0, 19.0, 22.0, 25.0, 29.0, 32.0, 36.0 ],
    9:  [10,   12,   15,   18,   21,   25,   30,   35,   40,   46,   52,   57  ], // IT7
    10: [14,   18,   22,   27,   33,   39,   46,   54,   63,   72,   81,   91  ], // IT8
    11: [25,   30,   36,   43,   52,   62,   74,   87,  100,  115,  130,  146  ], // IT9
    12: [40,   48,   58,   70,   84,  100,  120,  140,  160,  185,  210,  230  ], // IT10
    13: [60,   75,   90,  110,  130,  160,  190,  220,  250,  290,  320,  360  ], // IT11
    14: [100,  120,  150,  180,  210,  250,  300,  350,  400,  460,  520,  570  ], // IT12
    15: [160,  190,  230,  290,  340,  400,  480,  580,  660,  760,  860,  970  ], // IT13
    16: [250,  300,  360,  430,  520,  620,  740,  870, 1000, 1150, 1300, 1460  ], // IT14
    17: [400,  480,  580,  700,  840, 1000, 1200, 1400, 1600, 1850, 2100, 2300  ], // IT15 (注: GB/T 标准 IT15 ~ IT16 间近似)
    18: [600,  750,  900, 1100, 1300, 1600, 1900, 2200, 2500, 2900, 3200, 3600  ], // IT16 (近似)
};

// 基本偏差代号
// ISO 286 规定:
//   - 孔 A-H: 基本偏差是 EI (下偏差, 正值); ES = EI + IT
//   - 孔 JS: 对称偏差 ±IT/2
//   - 孔 J-ZC: 标准中规定 ES 是基本偏差, 但这里出于实用性采用与轴对称的定义
//   - 轴 a-h: 基本偏差是 es (上偏差, 负值或零); ei = es - IT
//   - 轴 js: 对称偏差 ±IT/2
//   - 轴 j, k: 基本偏差是 es = 0; ei = -IT (过渡配合常用)
//   - 轴 m-zc: 基本偏差是 ei (正值); es = ei + IT
const DEVIATION_DATA = {
    // ===== 孔 (大写) =====
    'A': { type: 'hole', base: 'lower', values: [270,270,280,290,300,310,330,360,390,420,460,480] },
    'B': { type: 'hole', base: 'lower', values: [140,140,150,150,160,170,180,190,200,210,220,240] },
    'C': { type: 'hole', base: 'lower', values: [ 34, 46, 56, 68, 77, 94,110,130,150,170,190,210] },
    'D': { type: 'hole', base: 'lower', values: [ 20, 30, 40, 50, 65, 80,100,120,145,170,190,210] },
    'E': { type: 'hole', base: 'lower', values: [ 14, 20, 25, 32, 40, 50, 60, 72, 85,100,110,125] },
    'F': { type: 'hole', base: 'lower', values: [  6, 10, 13, 16, 20, 25, 30, 36, 43, 50, 56, 62] },
    'G': { type: 'hole', base: 'lower', values: [  2,  4,  5,  6,  7,  9, 10, 12, 14, 15, 17, 18] },
    'H': { type: 'hole', base: 'lower', values: [0,0,0,0,0,0,0,0,0,0,0,0] },  // 基孔 EI=0
    'JS':{ type: 'hole', base: 'symmetric', values: null },
    'K': { type: 'hole', base: 'upper', values: [0,0,0,0,0,0,0,0,0,0,0,0] },  // 基轴制过渡, ES≈0 (常用 IT7 近似)
    'P': { type: 'hole', base: 'upper', values: [-6,-12,-15,-18,-22,-26,-32,-37,-43,-50,-56,-62] },  // 基轴制过盈, ES≈-ei(p) (常用 IT7 近似)

    // ===== 轴 (小写) =====
    'a': { type: 'shaft', base: 'upper', values: [-270,-270,-280,-290,-300,-310,-330,-360,-390,-420,-460,-480] },
    'b': { type: 'shaft', base: 'upper', values: [-140,-140,-150,-150,-160,-170,-180,-190,-200,-210,-220,-240] },
    'c': { type: 'shaft', base: 'upper', values: [ -34, -46, -56, -68, -77, -94,-110,-130,-150,-170,-190,-210] },
    'd': { type: 'shaft', base: 'upper', values: [ -20, -30, -40, -50, -65, -80,-100,-120,-145,-170,-190,-210] },
    'e': { type: 'shaft', base: 'upper', values: [ -14, -20, -25, -32, -40, -50, -60, -72, -85,-100,-110,-125] },
    'f': { type: 'shaft', base: 'upper', values: [  -6, -10, -13, -16, -20, -25, -30, -36, -43, -50, -56, -62] },
    'g': { type: 'shaft', base: 'upper', values: [  -2,  -4,  -5,  -6,  -7,  -9, -10, -12, -14, -15, -17, -18] },
    'h': { type: 'shaft', base: 'upper', values: [0,0,0,0,0,0,0,0,0,0,0,0] },  // 基轴 es=0
    'js':{ type: 'shaft', base: 'symmetric', values: null },

    // 轴 j, k 及过渡/过盈配合
    'k': { type: 'shaft', base: 'upper', values: [0,0,0,0,0,0,0,0,0,0,0,0] },  // 特殊: es=0
    'm': { type: 'shaft', base: 'lower', values: [2,4,6,7,8,9,11,13,15,17,20,21] },
    'n': { type: 'shaft', base: 'lower', values: [4,8,10,12,15,17,20,23,27,31,34,37] },
    'p': { type: 'shaft', base: 'lower', values: [6,12,15,18,22,26,32,37,43,50,56,62] },
    'r': { type: 'shaft', base: 'lower', values: [10,15,19,23,28,34,41,48,55,63,69,75] },
    's': { type: 'shaft', base: 'lower', values: [14,19,23,28,35,43,53,65,79,94,108,122] },
    't': { type: 'shaft', base: 'lower', values: [16,23,28,34,41,48,58,71,88,108,126,144] },
    'u': { type: 'shaft', base: 'lower', values: [18,28,33,40,50,60,70,83,101,131,160,180] },
};

// 尺寸段边界 (mm)
const SIZE_SEGMENT_BOUNDS = [3, 6, 10, 18, 30, 50, 80, 120, 180, 250, 315, 500];

// ===================================================================
// 核心函数
// ===================================================================

/** 根据基本尺寸获取尺寸段索引 (1-12) */
function getSizeSegment(dim) {
    for (let i = 0; i < SIZE_SEGMENT_BOUNDS.length; i++) {
        if (dim <= SIZE_SEGMENT_BOUNDS[i]) return i + 1;
    }
    return -1;
}

/** 获取标准公差 IT (单位 mm) */
function getIT(dim, grade) {
    const seg = getSizeSegment(dim);
    if (seg < 0) return null;
    // grade "01" -> 1, "0" -> 2, "1" -> 3, ..., "7" -> 9, "8" -> 10
    const idx = gradeIdx(grade);
    const vals = STANDARD_TOLERANCES[idx];
    if (!vals) return null;
    return vals[seg - 1] / 1000;
}

/** grade 字符串 -> STANDARD_TOLERANCES 索引 */
function gradeIdx(grade) {
    // 01 -> 1, 0 -> 2, 1 -> 3, 2 -> 4, ..., 7 -> 9, 8 -> 10
    if (grade === '01') return 1;
    if (grade === '0') return 2;
    return parseInt(grade, 10) + 2;
}

/** 解析公差代号, 返回 { letter, grade } */
function parseToleranceCode(code) {
    if (!code) return null;
    const m = code.match(/^([A-Za-z]+)(\d+)$/);
    if (!m) return null;
    return { letter: m[1], grade: m[2] };
}

/** 获取基本偏差 (mm), 返回 { upper, lower } */
function getDeviation(dim, code) {
    const parsed = parseToleranceCode(code);
    if (!parsed) return null;
    const data = DEVIATION_DATA[parsed.letter];
    if (!data) return null;
    const seg = getSizeSegment(dim);
    if (seg < 0) return null;
    const it = getIT(dim, parsed.grade);
    if (it === null) return null;

    if (data.base === 'symmetric') {
        return { upper: it / 2, lower: -it / 2 };
    }

    const baseVal = data.values[seg - 1] / 1000;  // μm → mm

    if (data.type === 'hole' && data.base === 'lower') {
        // 孔 A-H: 基本偏差是 EI (下偏差, 正值), ES = EI + IT
        return { upper: baseVal + it, lower: baseVal };
    } else if (data.type === 'shaft' && data.base === 'upper') {
        // 轴 a-h, k: 基本偏差是 es (上偏差, 负值或零), ei = es - IT
        // 但 k 是特殊情况: es = 0, ei = -IT
        if (parsed.letter === 'k') {
            // k: es = 0 (即 base 值), ei = es + IT 是不对的, 应该是 es = 0, ei = -IT
            // baseVal = 0 = es, ei = es - IT = -IT
            // 实际上 k 段 6 是 ei = +IT, 这是 GB/T 中国习惯 (基轴制常用)
            // 按 ISO 标准: ei = 0, es = +IT (k 是过渡配合基本偏差)
            return { upper: baseVal + it, lower: baseVal };
        }
        return { upper: baseVal, lower: baseVal - it };
    } else if (data.type === 'shaft' && data.base === 'lower') {
        // 轴 m-zc: 基本偏差是 ei (正值), es = ei + IT
        return { upper: baseVal + it, lower: baseVal };
    } else if (data.type === 'hole' && data.base === 'upper') {
        // 备选, 当前未使用
        return { upper: baseVal, lower: baseVal - it };
    }
    return null;
}

/** 完整查询: 尺寸 + 公差代号 → 上下偏差 */
function queryTolerance(dim, code) {
    const parsed = parseToleranceCode(code);
    if (!parsed) return { error: '公差代号格式错误 (例如 H7, h6)' };
    const dev = getDeviation(dim, code);
    if (!dev) return { error: '不支持的基本偏差代号: ' + parsed.letter };
    const it = getIT(dim, parsed.grade);
    if (it === null) return { error: '不支持的公差等级: IT' + parsed.grade };

    return {
        dim: dim,
        code: parsed.letter + parsed.grade,
        letter: parsed.letter,
        grade: parsed.grade,
        type: DEVIATION_DATA[parsed.letter].type,
        IT: it,
        upperDev: dev.upper,
        lowerDev: dev.lower,
        maxDim: dim + dev.upper,
        minDim: dim + dev.lower
    };
}

/** 孔轴配合查询: 尺寸 + 孔代号 + 轴代号 → Xmax, Xmin, 配合性质 */
function queryFit(dim, holeCode, shaftCode) {
    const hole = queryTolerance(dim, holeCode);
    const shaft = queryTolerance(dim, shaftCode);
    if (hole.error) return { error: '孔代号错误: ' + hole.error };
    if (shaft.error) return { error: '轴代号错误: ' + shaft.error };

    // 孔 ES, EI (mm); 轴 es, ei (mm)
    const ES = hole.upperDev, EI = hole.lowerDev;
    const es = shaft.upperDev, ei = shaft.lowerDev;

    // Xmax = ES - ei (最大间隙), Xmin = EI - es (最小间隙, 负值表示过盈)
    const Xmax = ES - ei;
    const Xmin = EI - es;

    let fitType, fitName;
    if (Xmin >= 0) {
        fitType = 'clearance';
        fitName = '间隙配合';
    } else if (Xmax <= 0) {
        fitType = 'interference';
        fitName = '过盈配合';
    } else {
        fitType = 'transition';
        fitName = '过渡配合';
    }

    // Ymax / Ymin (过盈)
    const Ymax = ei < 0 ? -ei : 0;  // 最大过盈
    const Ymin = es > ES ? -(ES) : -(es);  // 最小过盈

    return {
        dim: dim,
        holeCode, shaftCode,
        hole, shaft,
        Xmax, Xmin,
        Ymax: -Xmin > 0 ? -Xmin : 0,
        Ymin: -Xmax > 0 ? -Xmax : 0,
        fitType, fitName
    };
}

// 暴露到全局
window.ToleranceData = {
    STANDARD_TOLERANCES, DEVIATION_DATA, SIZE_SEGMENT_BOUNDS,
    getSizeSegment, getIT, gradeIdx, parseToleranceCode,
    getDeviation, queryTolerance, queryFit
};

/* ===================================================================
 * 主应用逻辑
 * =================================================================== */

(function () {
    const TD = window.ToleranceData;

    // ---------- 工具函数 ----------
    function $(id) { return document.getElementById(id); }
    function fmtMm(v) { return (v >= 0 ? '+' : '') + v.toFixed(3) + ' mm'; }
    function fmtUm(v) { return (v >= 0 ? '+' : '') + Math.round(v * 1000) + ' μm'; }

    // ---------- Tab 切换 ----------
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
            btn.classList.add('active');
            $('tab-' + btn.dataset.tab).classList.add('active');
        });
    });

    // ---------- IT 速查表初始化 ----------
    (function buildITTable() {
        const thead = $('it-thead');
        const tbody = $('it-tbody');
        const bounds = TD.SIZE_SEGMENT_BOUNDS;
        let hdr = '<th>IT</th>';
        for (let i = 0; i < bounds.length; i++) {
            const lo = i === 0 ? '~' + bounds[0] : bounds[i - 1] + '~';
            const hi = '≤' + bounds[i];
            hdr += `<th>${lo}${hi}</th>`;
        }
        thead.innerHTML = hdr;

        const labels = {1:'IT01',2:'IT0',3:'IT1',4:'IT2',5:'IT3',6:'IT4',7:'IT5',8:'IT6',9:'IT7',10:'IT8',11:'IT9',12:'IT10',13:'IT11',14:'IT12',15:'IT13',16:'IT14',17:'IT15',18:'IT16'};
        const rowIds = [3,4,5,6,7,8,9,10,11,12,13,14,15,16]; // 常用 IT3-IT16
        let html = '';
        rowIds.forEach(idx => {
            const val = TD.STANDARD_TOLERANCES[idx];
            if (!val) return;
            html += `<tr><td><strong>${labels[idx]}</strong></td>`;
            val.forEach(v => {
                const display = v < 1 ? v.toFixed(2) : v;
                html += `<td>${display}</td>`;
            });
            html += '</tr>';
        });
        tbody.innerHTML = html;
    })();

    // ===================================================================
    // 单尺寸公差查询
    // ===================================================================

    function renderSingle() {
        const dimStr = $('single-dim').value.trim();
        const letter = $('single-letter').value;
        const grade = $('single-grade').value;
        const dim = parseFloat(dimStr);
        const code = letter + grade;
        const empty = $('single-empty');
        const result = $('single-result');

        if (!dim || dim <= 0 || dim > 500) {
            result.style.display = 'none';
            empty.style.display = '';
            empty.innerHTML = `<div style="font-size:48px">⚠️</div><div>尺寸范围: 0.01 ~ 500 mm</div>`;
            return;
        }

        const r = TD.queryTolerance(dim, code);
        if (r.error) {
            result.style.display = 'none';
            empty.style.display = '';
            empty.innerHTML = `<div class="error-banner">${r.error}</div>`;
            return;
        }

        empty.style.display = 'none';
        result.style.display = '';

        const isHole = r.type === 'hole';
        const typeLabel = isHole ? '孔' : '轴';
        const upperLabel = isHole ? '上偏差 ES' : '上偏差 es';
        const lowerLabel = isHole ? '下偏差 EI' : '下偏差 ei';

        // 公差带 SVG 计算
        const lower = r.lowerDev, upper = r.upperDev;
        const range = Math.max(Math.abs(lower), Math.abs(upper), 0.05);
        const svgWidth = 600;
        const centerX = svgWidth / 2;
        const scale = (svgWidth / 2 - 60) / range;
        const upperPx = centerX + upper * scale;
        const lowerPx = centerX + lower * scale;
        const bandLeft = Math.min(upperPx, lowerPx);
        const bandRight = Math.max(upperPx, lowerPx);

        const upperClass = r.upperDev >= 0 ? 'positive' : 'negative';
        const lowerClass = r.lowerDev >= 0 ? 'positive' : 'negative';

        result.innerHTML = `
            <div class="result-header">
                <div>
                    <div class="result-code">φ${r.dim} ${r.code}</div>
                    <div class="result-dim">${typeLabel}公差带 - GB/T 1800.1-2009</div>
                </div>
                <div style="text-align:right">
                    <div style="font-size:11px;color:var(--text-muted)">标准公差</div>
                    <div style="font-size:18px;font-weight:600;font-family:monospace;color:var(--primary)">IT${r.grade} = ${r.IT.toFixed(3)} mm</div>
                </div>
            </div>

            <div class="deviation-table">
                <div class="deviation-box ${upperClass}">
                    <div class="deviation-label">${upperLabel}</div>
                    <div class="deviation-value ${upperClass}">${fmtMm(r.upperDev)}</div>
                    <div class="deviation-sub">最大极限尺寸 = ${r.maxDim.toFixed(3)} mm</div>
                </div>
                <div class="deviation-box ${lowerClass}">
                    <div class="deviation-label">${lowerLabel}</div>
                    <div class="deviation-value ${lowerClass}">${fmtMm(r.lowerDev)}</div>
                    <div class="deviation-sub">最小极限尺寸 = ${r.minDim.toFixed(3)} mm</div>
                </div>
            </div>

            <div class="tolerance-band">
                <div class="band-title">公差带图示 (单位 μm)</div>
                <svg class="band-svg" viewBox="0 0 ${svgWidth} 240" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <linearGradient id="singleBandGrad" x1="0" x2="0" y1="0" y2="1">
                            <stop offset="0%" stop-color="#3b82f6"/>
                            <stop offset="100%" stop-color="#1e3a8a"/>
                        </linearGradient>
                        <filter id="singleBandShadow" x="-10%" y="-30%" width="120%" height="160%">
                            <feDropShadow dx="0" dy="2" stdDeviation="2.5" flood-opacity="0.25"/>
                        </filter>
                    </defs>

                    <!-- 左右背景: 负偏差区淡灰, 正偏差区白 -->
                    <rect x="0" y="0" width="${centerX}" height="240" fill="#f3f4f6"/>
                    <rect x="${centerX}" y="0" width="${centerX}" height="240" fill="white"/>

                    <!-- 零基准刻度 (顶部圆角标签 + 粗虚线) -->
                    <rect x="${centerX-50}" y="14" width="100" height="24" rx="12" fill="#1e293b"/>
                    <text x="${centerX}" y="31" text-anchor="middle" font-size="13" font-weight="700" fill="white">0 基本尺寸</text>
                    <line x1="${centerX}" y1="44" x2="${centerX}" y2="220" stroke="#475569" stroke-width="2" stroke-dasharray="6 4"/>

                    <!-- 上偏差区: 小标签 + 圆角标注 -->
                    <text x="${upperPx}" y="62" text-anchor="middle" font-size="11" font-weight="600" fill="${r.upperDev >= 0 ? '#16a34a' : '#dc2626'}">上偏差 ${isHole?'ES':'es'}</text>
                    <rect x="${upperPx-46}" y="68" width="92" height="32" rx="16"
                          fill="${r.upperDev >= 0 ? '#dcfce7' : '#fee2e2'}"
                          stroke="${r.upperDev >= 0 ? '#16a34a' : '#dc2626'}" stroke-width="2"/>
                    <text x="${upperPx}" y="90" text-anchor="middle" font-size="19" font-weight="700"
                          fill="${r.upperDev >= 0 ? '#15803d' : '#b91c1c'}">${r.upperDev >= 0 ? '+' : ''}${(r.upperDev*1000).toFixed(0)}</text>

                    <!-- 公差带: 圆角渐变矩形 + 阴影 -->
                    <rect x="${bandLeft}" y="116" width="${bandRight - bandLeft}" height="56" rx="12"
                          fill="url(#singleBandGrad)" filter="url(#singleBandShadow)"/>
                    <text x="${(bandLeft + bandRight) / 2}" y="150" text-anchor="middle"
                          font-size="15" font-weight="600" fill="white" opacity="0.95">公差带 IT${r.grade}</text>

                    <!-- 上偏差引线 (公差带顶到标注底) -->
                    <line x1="${upperPx}" y1="100" x2="${upperPx}" y2="116" stroke="${r.upperDev >= 0 ? '#16a34a' : '#dc2626'}" stroke-width="2.5"/>
                    <circle cx="${upperPx}" cy="116" r="5" fill="${r.upperDev >= 0 ? '#16a34a' : '#dc2626'}" stroke="white" stroke-width="1.5"/>

                    <!-- 下偏差引线 -->
                    <line x1="${lowerPx}" y1="172" x2="${lowerPx}" y2="188" stroke="${r.lowerDev >= 0 ? '#16a34a' : '#dc2626'}" stroke-width="2.5"/>
                    <circle cx="${lowerPx}" cy="172" r="5" fill="${r.lowerDev >= 0 ? '#16a34a' : '#dc2626'}" stroke="white" stroke-width="1.5"/>

                    <!-- 下偏差区: 圆角标注 + 小标签 -->
                    <rect x="${lowerPx-46}" y="188" width="92" height="32" rx="16"
                          fill="${r.lowerDev >= 0 ? '#dcfce7' : '#fee2e2'}"
                          stroke="${r.lowerDev >= 0 ? '#16a34a' : '#dc2626'}" stroke-width="2"/>
                    <text x="${lowerPx}" y="210" text-anchor="middle" font-size="19" font-weight="700"
                          fill="${r.lowerDev >= 0 ? '#15803d' : '#b91c1c'}">${r.lowerDev >= 0 ? '+' : ''}${(r.lowerDev*1000).toFixed(0)}</text>
                    <text x="${lowerPx}" y="234" text-anchor="middle" font-size="11" font-weight="600" fill="${r.lowerDev >= 0 ? '#16a34a' : '#dc2626'}">下偏差 ${isHole?'EI':'ei'}</text>
                </svg>
                <div class="band-info">
                    <span>公差带宽度 = ${r.IT.toFixed(3)} mm (${(r.IT*1000).toFixed(0)} μm)</span>
                    <span>基本尺寸 = ${r.dim} mm</span>
                </div>
            </div>

            <table class="dim-table">
                <thead>
                    <tr><th>参数</th><th>数值 (mm)</th><th>数值 (μm)</th></tr>
                </thead>
                <tbody>
                    <tr><td>基本尺寸</td><td>${r.dim.toFixed(3)}</td><td>${(r.dim*1000).toFixed(0)}</td></tr>
                    <tr><td>最大极限尺寸</td><td class="highlight">${r.maxDim.toFixed(3)}</td><td>${(r.maxDim*1000).toFixed(0)}</td></tr>
                    <tr><td>最小极限尺寸</td><td class="highlight">${r.minDim.toFixed(3)}</td><td>${(r.minDim*1000).toFixed(0)}</td></tr>
                    <tr><td>上偏差 (${isHole?'ES':'es'})</td><td>${fmtMm(r.upperDev).replace(' mm','')}</td><td>${r.upperDev >= 0 ? '+' : ''}${(r.upperDev*1000).toFixed(0)}</td></tr>
                    <tr><td>下偏差 (${isHole?'EI':'ei'})</td><td>${fmtMm(r.lowerDev).replace(' mm','')}</td><td>${r.lowerDev >= 0 ? '+' : ''}${(r.lowerDev*1000).toFixed(0)}</td></tr>
                    <tr><td>公差 IT${r.grade}</td><td>${r.IT.toFixed(4)}</td><td>${(r.IT*1000).toFixed(0)}</td></tr>
                </tbody>
            </table>
        `;
    }

    // 单尺寸事件绑定
    ['single-dim', 'single-letter', 'single-grade'].forEach(id => $(id).addEventListener('input', renderSingle));
    document.querySelectorAll('[data-quick]').forEach(btn => {
        btn.addEventListener('click', () => {
            const code = btn.dataset.quick;
            // 拆分代号, 最后一个数字是 grade
            const m = code.match(/^([A-Za-z]+)(\d+)$/);
            if (m) {
                $('single-letter').value = m[1];
                $('single-grade').value = m[2];
                renderSingle();
            }
        });
    });

    // ===================================================================
    // 孔轴配合查询
    // ===================================================================

    function renderFit() {
        const dimStr = $('fit-dim').value.trim();
        const holeCode = $('fit-hole').value.trim();
        const shaftCode = $('fit-shaft').value.trim();
        const dim = parseFloat(dimStr);
        const empty = $('fit-empty');
        const result = $('fit-result');

        if (!dim || dim <= 0 || dim > 500) {
            result.style.display = 'none';
            empty.style.display = '';
            empty.innerHTML = `<div style="font-size:48px">⚠️</div><div>尺寸范围: 0.01 ~ 500 mm</div>`;
            return;
        }

        const f = TD.queryFit(dim, holeCode, shaftCode);
        if (f.error) {
            result.style.display = 'none';
            empty.style.display = '';
            empty.innerHTML = `<div class="error-banner">${f.error}</div>`;
            return;
        }

        empty.style.display = 'none';
        result.style.display = '';

        // 计算两端的偏差范围
        const allLow = Math.min(f.hole.lowerDev, f.shaft.lowerDev);
        const allHigh = Math.max(f.hole.upperDev, f.shaft.upperDev);
        const range = Math.max(Math.abs(allLow), Math.abs(allHigh), 0.05);
        const svgWidth = 600;
        const centerX = svgWidth / 2;
        const scale = (svgWidth / 2 - 60) / range;

        const pos = (v) => centerX + v * scale;

        const ESpx = pos(f.hole.upperDev);
        const EIpx = pos(f.hole.lowerDev);
        const espx = pos(f.shaft.upperDev);
        const eipx = pos(f.shaft.lowerDev);

        const xMaxClass = f.Xmax >= 0 ? 'positive' : 'negative';
        const xMinClass = f.Xmin >= 0 ? 'positive' : 'negative';

        result.innerHTML = `
            <div class="result-header">
                <div>
                    <div class="result-code">φ${f.dim} ${f.holeCode}/${f.shaftCode}</div>
                    <div class="result-dim">孔轴配合 (${f.fitName})</div>
                </div>
                <div class="fit-badge ${f.fitType}">${f.fitName}</div>
            </div>

            <div class="fit-summary">
                <div class="fit-summary-box ${xMaxClass}">
                    <div class="label">最大间隙 Xmax = ES - ei</div>
                    <div class="value ${xMaxClass}">${f.Xmax >= 0 ? '+' : ''}${(f.Xmax*1000).toFixed(0)} μm</div>
                    <div class="sub">${f.Xmax >= 0 ? '正值=最大间隙量' : '负值=最大过盈量'}</div>
                </div>
                <div class="fit-summary-box ${xMinClass}">
                    <div class="label">最小间隙 Xmin = EI - es</div>
                    <div class="value ${xMinClass}">${f.Xmin >= 0 ? '+' : ''}${(f.Xmin*1000).toFixed(0)} μm</div>
                    <div class="sub">${f.Xmin >= 0 ? '正值=最小间隙量' : '负值=最大过盈量'}</div>
                </div>
            </div>

            <div class="tolerance-band">
                <div class="band-title">配合公差带图 (单位 μm)</div>
                <svg class="band-svg" viewBox="0 0 ${svgWidth} 460" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <linearGradient id="holeGrad" x1="0" x2="0" y1="0" y2="1">
                            <stop offset="0%" stop-color="#3b82f6"/>
                            <stop offset="100%" stop-color="#1e3a8a"/>
                        </linearGradient>
                        <linearGradient id="shaftGrad" x1="0" x2="0" y1="0" y2="1">
                            <stop offset="0%" stop-color="#64748b"/>
                            <stop offset="100%" stop-color="#334155"/>
                        </linearGradient>
                        <filter id="bandShadow" x="-10%" y="-30%" width="120%" height="160%">
                            <feDropShadow dx="0" dy="2" stdDeviation="2.5" flood-opacity="0.25"/>
                        </filter>
                    </defs>

                    <!-- 左右背景 -->
                    <rect x="0" y="0" width="${centerX}" height="460" fill="#f3f4f6"/>
                    <rect x="${centerX}" y="0" width="${centerX}" height="460" fill="white"/>

                    <!-- 零基准标签 + 虚线 -->
                    <rect x="${centerX-50}" y="18" width="100" height="24" rx="12" fill="#1e293b"/>
                    <text x="${centerX}" y="35" text-anchor="middle" font-size="13" font-weight="700" fill="white">0 基本尺寸</text>
                    <line x1="${centerX}" y1="48" x2="${centerX}" y2="438" stroke="#475569" stroke-width="2" stroke-dasharray="6 4"/>

                    <!-- ===== 孔公差带 (上半) ===== -->
                    <!-- 孔 ES 圆角标注 (顶部) -->
                    <rect x="${ESpx-46}" y="60" width="92" height="30" rx="15"
                          fill="${f.hole.upperDev >= 0 ? '#dcfce7' : '#fee2e2'}"
                          stroke="${f.hole.upperDev >= 0 ? '#16a34a' : '#dc2626'}" stroke-width="2"/>
                    <text x="${ESpx}" y="80" text-anchor="middle" font-size="17" font-weight="700"
                          fill="${f.hole.upperDev >= 0 ? '#15803d' : '#b91c1c'}">ES ${f.hole.upperDev >= 0 ? '+' : ''}${(f.hole.upperDev*1000).toFixed(0)}</text>

                    <!-- 孔 ES 引线 + 圆点 -->
                    <line x1="${ESpx}" y1="90" x2="${ESpx}" y2="110" stroke="${f.hole.upperDev >= 0 ? '#16a34a' : '#dc2626'}" stroke-width="2.5"/>
                    <circle cx="${ESpx}" cy="110" r="5" fill="${f.hole.upperDev >= 0 ? '#16a34a' : '#dc2626'}" stroke="white" stroke-width="1.5"/>

                    <!-- 孔公差带 (圆角渐变 + 阴影) -->
                    <rect x="${Math.min(ESpx, EIpx)}" y="110" width="${Math.abs(ESpx-EIpx)}" height="58" rx="12"
                          fill="url(#holeGrad)" filter="url(#bandShadow)"/>
                    <text x="${(ESpx+EIpx)/2}" y="135" text-anchor="middle" font-size="14" font-weight="500" fill="white" opacity="0.85">孔公差带</text>
                    <text x="${(ESpx+EIpx)/2}" y="155" text-anchor="middle" font-size="20" font-weight="700" fill="white">${f.holeCode}</text>

                    <!-- 孔 EI 引线 + 圆点 -->
                    <line x1="${EIpx}" y1="168" x2="${EIpx}" y2="188" stroke="${f.hole.lowerDev >= 0 ? '#16a34a' : '#dc2626'}" stroke-width="2.5"/>
                    <circle cx="${EIpx}" cy="168" r="5" fill="${f.hole.lowerDev >= 0 ? '#16a34a' : '#dc2626'}" stroke="white" stroke-width="1.5"/>

                    <!-- 孔 EI 圆角标注 (底部) -->
                    <rect x="${EIpx-46}" y="188" width="92" height="30" rx="15"
                          fill="${f.hole.lowerDev >= 0 ? '#dcfce7' : '#fee2e2'}"
                          stroke="${f.hole.lowerDev >= 0 ? '#16a34a' : '#dc2626'}" stroke-width="2"/>
                    <text x="${EIpx}" y="208" text-anchor="middle" font-size="17" font-weight="700"
                          fill="${f.hole.lowerDev >= 0 ? '#15803d' : '#b91c1c'}">EI ${f.hole.lowerDev >= 0 ? '+' : ''}${(f.hole.lowerDev*1000).toFixed(0)}</text>

                    <!-- ===== 中间分隔 (配合区) ===== -->
                    <line x1="80" y1="248" x2="${svgWidth-80}" y2="248" stroke="#cbd5e1" stroke-width="1" stroke-dasharray="3 5"/>
                    <text x="${centerX}" y="262" text-anchor="middle" font-size="12" font-weight="500" fill="#64748b">━━━━ 配合区 ━━━━</text>

                    <!-- ===== 轴公差带 (下半) ===== -->
                    <!-- 轴 es 圆角标注 (顶部) -->
                    <rect x="${espx-46}" y="278" width="92" height="30" rx="15"
                          fill="${f.shaft.upperDev >= 0 ? '#dcfce7' : '#fee2e2'}"
                          stroke="${f.shaft.upperDev >= 0 ? '#16a34a' : '#dc2626'}" stroke-width="2"/>
                    <text x="${espx}" y="298" text-anchor="middle" font-size="17" font-weight="700"
                          fill="${f.shaft.upperDev >= 0 ? '#15803d' : '#b91c1c'}">es ${f.shaft.upperDev >= 0 ? '+' : ''}${(f.shaft.upperDev*1000).toFixed(0)}</text>

                    <!-- 轴 es 引线 + 圆点 -->
                    <line x1="${espx}" y1="308" x2="${espx}" y2="328" stroke="${f.shaft.upperDev >= 0 ? '#16a34a' : '#dc2626'}" stroke-width="2.5"/>
                    <circle cx="${espx}" cy="328" r="5" fill="${f.shaft.upperDev >= 0 ? '#16a34a' : '#dc2626'}" stroke="white" stroke-width="1.5"/>

                    <!-- 轴公差带 (圆角渐变 + 阴影) -->
                    <rect x="${Math.min(espx, eipx)}" y="328" width="${Math.abs(espx-eipx)}" height="58" rx="12"
                          fill="url(#shaftGrad)" filter="url(#bandShadow)"/>
                    <text x="${(espx+eipx)/2}" y="353" text-anchor="middle" font-size="14" font-weight="500" fill="white" opacity="0.85">轴公差带</text>
                    <text x="${(espx+eipx)/2}" y="373" text-anchor="middle" font-size="20" font-weight="700" fill="white">${f.shaftCode}</text>

                    <!-- 轴 ei 引线 + 圆点 -->
                    <line x1="${eipx}" y1="386" x2="${eipx}" y2="406" stroke="${f.shaft.lowerDev >= 0 ? '#16a34a' : '#dc2626'}" stroke-width="2.5"/>
                    <circle cx="${eipx}" cy="386" r="5" fill="${f.shaft.lowerDev >= 0 ? '#16a34a' : '#dc2626'}" stroke="white" stroke-width="1.5"/>

                    <!-- 轴 ei 圆角标注 (底部) -->
                    <rect x="${eipx-46}" y="406" width="92" height="30" rx="15"
                          fill="${f.shaft.lowerDev >= 0 ? '#dcfce7' : '#fee2e2'}"
                          stroke="${f.shaft.lowerDev >= 0 ? '#16a34a' : '#dc2626'}" stroke-width="2"/>
                    <text x="${eipx}" y="426" text-anchor="middle" font-size="17" font-weight="700"
                          fill="${f.shaft.lowerDev >= 0 ? '#15803d' : '#b91c1c'}">ei ${f.shaft.lowerDev >= 0 ? '+' : ''}${(f.shaft.lowerDev*1000).toFixed(0)}</text>
                </svg>
            </div>

            <table class="dim-table">
                <thead><tr><th>项目</th><th>孔 (${f.holeCode})</th><th>轴 (${f.shaftCode})</th></tr></thead>
                <tbody>
                    <tr><td>上偏差</td><td class="highlight">${fmtMm(f.hole.upperDev)}</td><td class="highlight">${fmtMm(f.shaft.upperDev)}</td></tr>
                    <tr><td>下偏差</td><td class="highlight">${fmtMm(f.hole.lowerDev)}</td><td class="highlight">${fmtMm(f.shaft.lowerDev)}</td></tr>
                    <tr><td>公差 IT</td><td>${f.hole.IT.toFixed(4)} mm</td><td>${f.shaft.IT.toFixed(4)} mm</td></tr>
                    <tr><td>最大极限尺寸</td><td>${f.hole.maxDim.toFixed(3)}</td><td>${f.shaft.maxDim.toFixed(3)}</td></tr>
                    <tr><td>最小极限尺寸</td><td>${f.hole.minDim.toFixed(3)}</td><td>${f.shaft.minDim.toFixed(3)}</td></tr>
                </tbody>
            </table>
        `;
    }

    ['fit-dim', 'fit-hole', 'fit-shaft'].forEach(id => $(id).addEventListener('input', renderFit));
    document.querySelectorAll('[data-fit]').forEach(btn => {
        btn.addEventListener('click', () => {
            const txt = btn.dataset.fit;
            const parts = txt.split('/');
            if (parts.length === 2) {
                $('fit-hole').value = parts[0];
                $('fit-shaft').value = parts[1];
                renderFit();
            }
        });
    });

    // ---------- 初始渲染 ----------
    renderSingle();
    renderFit();
})();

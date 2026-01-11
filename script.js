// ------------- 全局配置常量 -------------
var CONFIG = {
    singleColumnSize: 10,
    pageSize: 60,
    currentPage: 1,
    currentDirection: "A",
    currentRouteNum: "",
    currentRouteData: null,
    enabledShifts: [],
    loadingTime: 1,
    keyboardOpacityDisabled: '0.5',
    keyboardOpacityEnabled: '1',
    emptyTipText: {
        'zh-CN': '暂无站点数据',
        'en-US': 'No stop data available'
    },
    suggestTimeout: null,
    currentLang: 'zh-CN' // 默认简体中文
};

// ------------- 增强版语言处理工具类 -------------
var LangHandler = {
    getText: function(key, replacements = {}) {
        const lang = CONFIG.currentLang || 'zh-CN';
        // 兜底机制：优先当前语言 -> 中文 -> 原key
        let text = (LANG_PACK?.[lang]?.[key] || LANG_PACK?.['zh-CN']?.[key] || key);
        
        // 修复：确保替换所有占位符，处理边界情况
        if (typeof text === 'string' && Object.keys(replacements).length > 0) {
            Object.keys(replacements).forEach(placeholder => {
                // 使用全局替换，确保所有相同占位符都被替换
                const regex = new RegExp(`\\{${placeholder}\\}`, 'g');
                text = text.replace(regex, replacements[placeholder] || '');
            });
        }
        
        return text;
    },

    // 批量渲染所有带data-lang-key的元素（增强版）
    renderAllTexts: function() {
        // 更新HTML根元素lang属性，适配CSS语言样式
        document.documentElement.lang = CONFIG.currentLang;
        
        document.querySelectorAll('[data-lang-key]').forEach(el => {
            const key = el.getAttribute('data-lang-key');
            const replacements = this._getReplacementsFromElement(el);
            
            try {
                if (el.tagName === 'INPUT' && el.hasAttribute('placeholder')) {
                    el.setAttribute('placeholder', this.getText(key, replacements));
                } else if (el.hasAttribute('data-lang-html')) {
                    el.innerHTML = this.getText(key, replacements);
                } else {
                    el.textContent = this.getText(key, replacements);
                }
                
                // 为语言切换添加UI过渡效果
                el.style.opacity = '0.8';
                setTimeout(() => {
                    el.style.opacity = '1';
                }, 200);
                
            } catch (e) {
                console.warn(`渲染语言文案失败 [${key}]`, e);
            }
        });
        
        // 更新动态生成的空提示文本
        this.updateDynamicEmptyTips();
    },

    updateDynamicEmptyTips: function() {
        document.querySelectorAll('.empty-tip').forEach(tip => {
            if (tip.closest('.stop-wrap') || tip.closest('#stopContainer')) {
                tip.textContent = CONFIG.emptyTipText[CONFIG.currentLang];
            }
        });
    },

    _getReplacementsFromElement: function(el) {
        const replacements = {};
        Array.from(el.attributes).forEach(attr => {
            if (attr.name.startsWith('data-replace-')) {
                const placeholder = attr.name.replace('data-replace-', '');
                replacements[placeholder] = attr.value;
            }
        });
        return replacements;
    },

    getShiftLabel: function(shiftKey) {
        const keyMap = {
            'normal': 'normalShift',
            'special1': 'specialShift1',
            'special2': 'specialShift2',
            'special3': 'specialShift3'
        };
        return this.getText(keyMap[shiftKey] || shiftKey);
    }
};

// ------------- 重置函数优化 -------------
function resetRouteQueryState() {
    // 1. 重置全局配置
    CONFIG.currentRouteNum = "";
    CONFIG.currentRouteData = null;
    CONFIG.enabledShifts = [];
    CONFIG.currentPage = 1;
    CONFIG.currentDirection = "A";
    
    // 2. 清空线路编号输入框
    const input = document.getElementById('routeNumberInput');
    if (input) {
        input.value = '';
        Renderer.initKeyboardValidity('');
        Renderer.renderRouteSuggestions(''); // 确保重置时也重新渲染
        // 重置输入框占位符
        input.setAttribute('placeholder', LangHandler.getText('inputPlaceholder'));
    }
    
    // 3. 关闭运营时间面板（如果打开）
    const timetablePanel = document.getElementById('timetablePanel');
    if (timetablePanel) timetablePanel.remove();
    
    // 4. 重置空提示文本
    LangHandler.updateDynamicEmptyTips();
}

// ------------- 增强版页面切换控制层 -------------
var PageController = {
    // 初始化页面切换事件
    initPageEvents: function() {
        const self = this;
        
        // 加载页面自动跳转到功能选择页
        setTimeout(() => {
            self.showScreen('funcScreen');
            self.hideScreen('loadingScreen');
        }, CONFIG.loadingTime * 1000);

        // 功能选择页 - 线路查询
        document.getElementById('routeSelectFunc')?.addEventListener('click', () => {
            self.showScreen('inputScreen');
            self.hideScreen('funcScreen');
        });

        // 功能选择页 - 更新日志
        document.getElementById('updateLogFunc')?.addEventListener('click', () => {
            self.showScreen('updateLogScreen');
            self.hideScreen('funcScreen');
            Renderer.renderUpdateLog();
        });

        // 返回按钮事件
        document.getElementById('backToLoadingBtn')?.addEventListener('click', () => {
            self.showScreen('loadingScreen');
            self.hideScreen('funcScreen');
        });

        document.getElementById('backToFuncBtn')?.addEventListener('click', () => {
            self.showScreen('funcScreen');
            self.hideScreen('inputScreen');
            resetRouteQueryState();
        });

        document.getElementById('backToInputBtn')?.addEventListener('click', () => {
            self.showScreen('inputScreen');
            self.hideScreen('stopScreen');
            resetRouteQueryState();
        });

        document.getElementById('backToFuncFromLogBtn')?.addEventListener('click', () => {
            self.showScreen('funcScreen');
            self.hideScreen('updateLogScreen');
        });

        // 增强版语言切换事件（带UI反馈 + 修复线路建议即时翻译）
        document.getElementById('switchZhBtn')?.addEventListener('click', function() {
            this.classList.add('active');
            document.getElementById('switchEnBtn').classList.remove('active');
            // 添加切换动画
            this.style.transform = 'scale(1.1)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 200);
            CONFIG.currentLang = 'zh-CN';
            Renderer.updatePageLang();
            
            // 修复核心：语言切换时重新渲染线路建议列表
            const input = document.getElementById('routeNumberInput');
            if (input) {
                Renderer.renderRouteSuggestions(input.value); // 重新渲染建议列表
            }
        });
        
        document.getElementById('switchEnBtn')?.addEventListener('click', function() {
            this.classList.add('active');
            document.getElementById('switchZhBtn').classList.remove('active');
            // 添加切换动画
            this.style.transform = 'scale(1.1)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 200);
            CONFIG.currentLang = 'en-US';
            Renderer.updatePageLang();
            
            // 修复核心：语言切换时重新渲染线路建议列表
            const input = document.getElementById('routeNumberInput');
            if (input) {
                Renderer.renderRouteSuggestions(input.value); // 重新渲染建议列表
            }
        });
        
    },
    
    showScreen: function(screenId) {
        const screen = document.getElementById(screenId);
        if (screen) {
            // 添加显示动画
            screen.classList.remove('hidden');
            screen.style.opacity = '0';
            screen.style.transform = 'translateY(20px)';
            setTimeout(() => {
                screen.style.opacity = '1';
                screen.style.transform = 'translateY(0)';
                screen.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            }, 50);
        }
        Renderer.updatePageLang();
        
        // 额外修复：切换屏幕时如果是输入页，重新渲染建议列表
        if (screenId === 'inputScreen') {
            const input = document.getElementById('routeNumberInput');
            if (input) {
                Renderer.renderRouteSuggestions(input.value);
            }
        }
    },
    
    hideScreen: function(screenId) {
        const screen = document.getElementById(screenId);
        if (screen) {
            // 添加隐藏动画
            screen.style.opacity = '0';
            screen.style.transform = 'translateY(-20px)';
            setTimeout(() => {
                screen.classList.add('hidden');
                screen.style.opacity = '1';
                screen.style.transform = 'translateY(0)';
            }, 300);
        }
    }
};

// ------------- 数据处理核心层 -------------
var DataHandler = {
    // 获取所有启用的线路
    getValidRoutes: function() {
        if (typeof routeData === 'undefined' || !routeData || !routeData.data) return [];
        var validRoutes = [];
        for (var i = 0; i < routeData.data.length; i++) {
            if (routeData.data[i].enabled === true) {
                validRoutes.push(routeData.data[i]);
            }
        }
        return validRoutes;
    },

    // 获取所有启用线路的编号
    getValidRouteNums: function() {
        var validRoutes = this.getValidRoutes();
        var nums = [];
        for (var i = 0; i < validRoutes.length; i++) {
            nums.push(validRoutes[i].route.toUpperCase());
        }
        return nums;
    },

    // 根据编号获取线路详情
    getRouteByNum: function(routeNum) {
        if (!routeNum || typeof routeData === 'undefined' || !routeData || !routeData.data) return null;
        var validRoutes = this.getValidRoutes();
        for (var i = 0; i < validRoutes.length; i++) {
            if (validRoutes[i].route.toUpperCase() === routeNum.toUpperCase()) {
                return validRoutes[i];
            }
        }
        return null;
    },

    // 获取线路启用的班次类型
    getEnabledShifts: function(routeItem) {
        if (!routeItem || !routeItem.shifts) return [];
        var shifts = [];
        for (var key in routeItem.shifts) {
            if (routeItem.shifts.hasOwnProperty(key) && routeItem.shifts[key] === true) {
                shifts.push(key);
            }
        }
        return shifts;
    },

    // 获取班次配置（名称/颜色）- 多语言适配
    getShiftConfig: function(routeItem, shiftKey) {
        if (!routeItem || !shiftKey || !routeItem.shiftConfig) {
            return {
                label: LangHandler.getShiftLabel(shiftKey),
                color: shiftKey === 'normal' ? '#4a90e2' : '#e53e3e'
            };
        }
        
        // 如果配置中有多语言名称，优先使用
        const config = routeItem.shiftConfig[shiftKey] || {};
        const label = config.label || config.labelCn || LangHandler.getShiftLabel(shiftKey);
        
        return {
            label: label,
            color: config.color || '#4a90e2'
        };
    },

    // 获取班次的起止站点（修复：多语言适配 + 循环线显示问题）
    getShiftStartEnd: function(routeItem, shiftKey) {
        if (!routeItem || !shiftKey) return { start: LangHandler.getText('noInformation'), end: LangHandler.getText('noInformation') };
        
        var targetDirection = "A";
        if (routeItem.bound && routeItem.bound.indexOf("C") !== -1) {
            targetDirection = "C";
        }
        
        var shiftStops = [];
        if (routeItem.stops && routeItem.stops[targetDirection]) {
            for (var i = 0; i < routeItem.stops[targetDirection].length; i++) {
                var stop = routeItem.stops[targetDirection][i];
                if (stop.visible && stop.stopFor && stop.stopFor.indexOf(shiftKey) !== -1) {
                    shiftStops.push(stop);
                }
            }
        }
        
        shiftStops.sort(function(a, b) {
            return a.seq - b.seq;
        });
        
        if (shiftStops.length === 0) {
            var directions = ["A", "B", "C"];
            for (var d = 0; d < directions.length; d++) {
                var dir = directions[d];
                if (dir === targetDirection || !routeItem.stops[dir]) continue;
                
                for (var i = 0; i < routeItem.stops[dir].length; i++) {
                    var stop = routeItem.stops[dir][i];
                    if (stop.visible && stop.stopFor && stop.stopFor.indexOf(shiftKey) !== -1) {
                        shiftStops.push(stop);
                    }
                }
                if (shiftStops.length > 0) break;
            }
            
            if (shiftStops.length === 0) {
                return { start: LangHandler.getText('noInformation'), end: LangHandler.getText('noInformation') };
            }
            shiftStops.sort(function(a, b) {
                return a.seq - b.seq;
            });
        }
        
        // 处理站点名称，移除^^标识（全局生效）
        const cleanStopName = (stop) => {
            if (CONFIG.currentLang === 'zh-CN') {
                return (stop.nameCn || '').replace(/\^\^/g, '');
            } else {
                // 英文版本只显示英文名称，不显示中文
                return (stop.nameEn || '').replace(/\^\^/g, '');
            }
        };
        
        // 获取起点和终点（初始值）
        var startName = cleanStopName(shiftStops[0]);
        var endName = cleanStopName(shiftStops[shiftStops.length - 1]);
        
        // 判断是否是循环线终点（包含^^标识）
        const isCircularEndStop = (stop) => {
            return (stop.nameCn && stop.nameCn.includes('^^')) || (stop.nameEn && stop.nameEn.includes('^^'));
        };
        
        // 循环线特殊处理 - 强制找到带^^的转折点作为终点（修复问题3）
        if (routeItem.bound && routeItem.bound.indexOf("C") !== -1) {
            // 遍历所有站点，优先找带^^的转折点
            let circularEndStop = null;
            for (let i = 0; i < shiftStops.length; i++) {
                if (isCircularEndStop(shiftStops[i])) {
                    circularEndStop = shiftStops[i];
                    break; // 找到第一个转折点就停止
                }
            }
            
            // 强制使用转折点作为终点（即使找到最后一个站点）
            if (circularEndStop) {
                endName = cleanStopName(circularEndStop);
            }
            
            // 构建循环线显示文本（仅添加标识，不拼接线路号）
            if (CONFIG.currentLang === 'zh-CN') {
                endName = `${endName}（转折点）`;
            } else {
                endName = `${endName} (Turning Point)`;
            }
        }
        
        return {
            start: startName || LangHandler.getText('noInformation'),
            end: endName || LangHandler.getText('noInformation')
        };
    },

    // 获取当前方向下的有效站点
    getValidStops: function(routeItem) {
        if (!routeItem || !routeItem.stops) return [];
        
        var targetDirection = CONFIG.currentDirection;
        if (routeItem.bound && routeItem.bound.indexOf("C") !== -1) {
            targetDirection = "C";
            CONFIG.currentDirection = "C";
        }
        
        var directionStops = routeItem.stops[targetDirection] || [];
        var validStops = [];

        for (var i = 0; i < directionStops.length; i++) {
            var stop = directionStops[i];
            if (stop.visible) {
                validStops.push(stop);
            }
        }

        if (validStops.length === 0) {
            for (var dir in routeItem.stops) {
                if (routeItem.stops.hasOwnProperty(dir)) {
                    var dirStops = routeItem.stops[dir];
                    for (var s = 0; s < dirStops.length; s++) {
                        var stop = dirStops[s];
                        if (stop.visible) {
                            validStops.push(stop);
                        }
                    }
                }
                if (validStops.length > 0) break;
            }
        }

        validStops.sort(function(a, b) {
            return a.seq - b.seq;
        });

        return validStops;
    },

    // 获取当前方向下的首尾站点（修复：多语言适配）
    getDirectionStartEndStops: function(routeItem) {
        if (!routeItem) return { first: LangHandler.getText('noInformation'), last: LangHandler.getText('noInformation') };
        
        var targetDirection = CONFIG.currentDirection;
        if (routeItem.bound && routeItem.bound.indexOf("C") !== -1) {
            targetDirection = "C";
        }
        
        var directionStops = routeItem.stops[targetDirection] || [];
        var validStops = [];
        
        for (var i = 0; i < directionStops.length; i++) {
            var stop = directionStops[i];
            if (!stop.visible) continue;
            
            var hasShift = false;
            for (var j = 0; j < CONFIG.enabledShifts.length; j++) {
                var shiftKey = CONFIG.enabledShifts[j];
                if (stop.stopFor && stop.stopFor.indexOf(shiftKey) !== -1) {
                    hasShift = true;
                    break;
                }
            }
            
            if (hasShift) {
                validStops.push(stop);
            }
        }
        
        if (validStops.length === 0) {
            for (var i = 0; i < directionStops.length; i++) {
                var stop = directionStops[i];
                if (stop.visible) {
                    validStops.push(stop);
                }
            }
        }
        
        if (validStops.length === 0) {
            var allDirections = ["A", "B", "C"];
            for (var d = 0; d < allDirections.length; d++) {
                var dir = allDirections[d];
                if (dir === targetDirection) continue;
                
                var altDirectionStops = routeItem.stops[dir] || [];
                for (var s = 0; s < altDirectionStops.length; s++) {
                    var stop = altDirectionStops[s];
                    if (stop.visible) {
                        validStops.push(stop);
                    }
                }
                
                if (validStops.length > 0) break;
            }
        }
        
        if (validStops.length === 0) {
            return { first: LangHandler.getText('noInformation'), last: LangHandler.getText('noInformation') };
        }
        
        validStops.sort(function(a, b) {
            return a.seq - b.seq;
        });
        
        var firstName = CONFIG.currentLang === 'zh-CN' 
            ? (validStops[0].nameCn || LangHandler.getText('noInformation'))
            : (validStops[0].nameEn || validStops[0].nameCn || LangHandler.getText('noInformation'));
        
        var lastName = CONFIG.currentLang === 'zh-CN' 
            ? (validStops[validStops.length - 1].nameCn || LangHandler.getText('noInformation'))
            : (validStops[validStops.length - 1].nameEn || validStops[validStops.length - 1].nameCn || LangHandler.getText('noInformation'));
        
        if (routeItem.bound && routeItem.bound.indexOf("C") !== -1) {
            lastName = firstName;
        }
        
        var dirLabelKey = routeItem.bound && routeItem.bound.indexOf("C") !== -1 ? 'loopDirection' : 'driveDirection';
        var dirLabel = LangHandler.getText(dirLabelKey);
        
        return {
            first: firstName,
            last: lastName
        };
    },

    // 判断线路是否支持方向切换
    isRouteSupportDirectionSwitch: function(routeItem) {
        if (!routeItem) return false;
        
        if (routeItem.bound && routeItem.bound.indexOf("C") !== -1) return false;
        
        var hasABBound = routeItem.bound && routeItem.bound.indexOf("A") !== -1 && routeItem.bound.indexOf("B") !== -1;
        
        var hasAStops = false;
        var hasBStops = false;
        if (routeItem.stops) {
            hasAStops = routeItem.stops.A && routeItem.stops.A.length > 0;
            hasBStops = routeItem.stops.B && routeItem.stops.B.length > 0;
        }
        
        return hasABBound && hasAStops && hasBStops;
    },

    // 获取指定班次的站点列表
    getShiftStopStops: function(routeItem, shiftKey) {
        if (!routeItem || !shiftKey) return [];
        
        var targetDirection = CONFIG.currentDirection;
        if (routeItem.bound && routeItem.bound.indexOf("C") !== -1) {
            targetDirection = "C";
        }
        
        var directionStops = routeItem.stops[targetDirection] || [];
        var shiftStops = [];
        
        for (var i = 0; i < directionStops.length; i++) {
            var stop = directionStops[i];
            if (stop.visible && stop.stopFor && stop.stopFor.indexOf(shiftKey) !== -1) {
                shiftStops.push(stop);
            }
        }
        
        shiftStops.sort(function(a, b) {
            return a.seq - b.seq;
        });
        
        return shiftStops;
    },

    // 判断是否是班次起点站
    isShiftStartStop: function(routeItem, stop, shiftKey) {
        var shiftStops = this.getShiftStopStops(routeItem, shiftKey);
        if (shiftStops.length === 0) return false;
        var firstShiftStop = shiftStops[0];
        return stop.seq === firstShiftStop.seq;
    },

    // 判断是否是班次终点站
    isShiftEndStop: function(routeItem, stop, shiftKey) {
        if (routeItem.bound && routeItem.bound.indexOf("C") !== -1) {
            var shiftStops = this.getShiftStopStops(routeItem, shiftKey);
            if (shiftStops.length === 0) return false;
            var lastShiftStop = shiftStops[shiftStops.length - 1];
            return stop.seq === lastShiftStop.seq;
        }
        
        var shiftStops = this.getShiftStopStops(routeItem, shiftKey);
        if (shiftStops.length === 0) return false;
        var lastShiftStop = shiftStops[shiftStops.length - 1];
        return stop.seq === lastShiftStop.seq;
    },

    // 判断站点是否在班次范围内
    isStopInShiftRange: function(routeItem, stop, shiftKey) {
        var shiftStops = this.getShiftStopStops(routeItem, shiftKey);
        if (shiftStops.length === 0) return false;
        var minSeq = shiftStops[0].seq;
        var maxSeq = shiftStops[shiftStops.length - 1].seq;
        return stop.seq >= minSeq && stop.seq <= maxSeq;
    },

    // 获取站点在班次中的本地序号
    getShiftLocalSeq: function(routeItem, stop, shiftKey) {
        if (!routeItem || !stop || !shiftKey) return "";
        
        if (!this.isStopInShiftRange(routeItem, stop, shiftKey)) {
            return "";
        }
        
        if (shiftKey === "normal") {
            return stop.seq.toString();
        }
        
        var shiftStops = this.getShiftStopStops(routeItem, shiftKey);
        if (shiftStops.length === 0) return "";
        
        for (var i = 0; i < shiftStops.length; i++) {
            if (shiftStops[i].seq === stop.seq) {
                return (i + 1).toString();
            }
        }
        
        return "";
    },

    // 分页获取站点
    getStopsByPage: function(validStops, pageNum) {
        if (!validStops || validStops.length === 0) return [];
        var startIdx = (pageNum - 1) * CONFIG.pageSize;
        var endIdx = startIdx + CONFIG.pageSize;
        return validStops.slice(startIdx, endIdx);
    },

    // 拆分站点为两列
    splitStopsToColumns: function(pageStops) {
        var leftStops = pageStops.slice(0, CONFIG.singleColumnSize);
        var rightStops = pageStops.slice(CONFIG.singleColumnSize, CONFIG.pageSize);
        return { leftStops: leftStops, rightStops: rightStops };
    },

    // 获取总页数
    getTotalPages: function(validStops) {
        if (!validStops || validStops.length === 0) return 1;
        return Math.ceil(validStops.length / CONFIG.pageSize);
    },

    // 获取匹配的线路前缀（修复：空输入时返回所有线路）
    getMatchedRoutePrefixes: function(currentInput) {
        var currentInputUpper = (currentInput || '').toString().toUpperCase().trim();
        var validRoutes = this.getValidRouteNums();
        
        // 空输入时返回所有线路
        if (!currentInputUpper) {
            return validRoutes; // 移除slice(0,10)限制，返回全部
        }
        
        var matchedRoutes = [];
        for (var i = 0; i < validRoutes.length; i++) {
            if (validRoutes[i].startsWith(currentInputUpper)) {
                matchedRoutes.push(validRoutes[i]);
            }
        }
        
        return matchedRoutes; // 移除slice(0,10)限制，返回全部匹配结果
    },

    // 获取运营时间数据（修复：时间表显示问题）
    getTimetableData: function(routeItem, direction = null) {
        if (!routeItem || typeof routeData === 'undefined') return null;
        
        var targetDirection = direction || CONFIG.currentDirection;
        
        if (routeItem.bound && routeItem.bound.indexOf("C") !== -1) {
            targetDirection = "C";
        }
        
        // 修复：增加更多的时间数据来源适配
        var timetableData = routeItem.timetable || routeItem.operationTime || routeItem.timeTable || null;
        if (!timetableData) return null;
        
        // 修复：处理不同的数据格式
        if (typeof timetableData === 'string') {
            return {
                direction: targetDirection,
                data: { text: timetableData },
                hasOtherDirection: false
            };
        }
        
        if (timetableData[targetDirection]) {
            return {
                direction: targetDirection,
                data: timetableData[targetDirection],
                hasOtherDirection: (targetDirection === "A" && timetableData.B) || 
                                (targetDirection === "B" && timetableData.A)
            };
        }
        
        if (typeof timetableData === 'object' && !timetableData.A && !timetableData.B && !timetableData.C) {
            return {
                direction: targetDirection,
                data: timetableData,
                hasOtherDirection: false
            };
        }
        
        var otherDirection = targetDirection === "A" ? "B" : "A";
        if (timetableData[otherDirection]) {
            return {
                direction: otherDirection,
                data: timetableData[otherDirection],
                hasOtherDirection: true
            };
        }
        
        return null;
    },

    // 获取线路支持的运营时间方向
    getTimetableDirections: function(routeItem) {
        if (!routeItem || !routeItem.timetable) return [];
        
        var directions = [];
        var timetableData = routeItem.timetable;
        
        if (routeItem.bound && routeItem.bound.indexOf("C") !== -1) {
            return ["C"];
        }
        
        if (timetableData.A) directions.push("A");
        if (timetableData.B) directions.push("B");
        
        return directions.length > 0 ? directions : [];
    },

    // 获取班次运营范围内的所有站点
    getShiftInRangeStops: function(routeItem, shiftKey) {
        var targetDirection = CONFIG.currentDirection;
        if (routeItem.bound && routeItem.bound.indexOf("C") !== -1) {
            targetDirection = "C";
        }
        var directionStops = routeItem.stops[targetDirection] || [];
        var inRangeStops = [];
        for (var i = 0; i < directionStops.length; i++) {
            var stop = directionStops[i];
            if (stop.visible && this.isStopInShiftRange(routeItem, stop, shiftKey)) {
                inRangeStops.push(stop);
            }
        }
        inRangeStops.sort(function(a, b) {
            return a.seq - b.seq;
        });
        return inRangeStops;
    },

    getRouteStartEndInfo: function(routeItem) {
        if (!routeItem) return { start: LangHandler.getText('noInformation'), end: LangHandler.getText('noInformation') };
        
        // 获取常规班次的起终点
        var normalShiftStartEnd = this.getShiftStartEnd(routeItem, 'normal');
        if (normalShiftStartEnd.start !== LangHandler.getText('noInformation')) {
            return normalShiftStartEnd;
        }
        
        // 如果没有常规班次，获取第一个可用班次的起终点
        var enabledShifts = this.getEnabledShifts(routeItem);
        for (var i = 0; i < enabledShifts.length; i++) {
            var shiftStartEnd = this.getShiftStartEnd(routeItem, enabledShifts[i]);
            if (shiftStartEnd.start !== LangHandler.getText('noInformation')) {
                return shiftStartEnd;
            }
        }
        
        return { start: LangHandler.getText('noInformation'), end: LangHandler.getText('noInformation') };
    },

        getAllShiftsStartEndInfo: function(routeItem) {
        if (!routeItem) return [];
        
        // 确保获取所有启用的班次（修复问题2）
        var enabledShifts = this.getEnabledShifts(routeItem) || [];
        var shiftInfoList = [];
        
        // 遍历所有启用的班次，确保无遗漏
        for (var i = 0; i < enabledShifts.length; i++) {
            var shiftKey = enabledShifts[i];
            var shiftConfig = this.getShiftConfig(routeItem, shiftKey);
            var shiftStartEnd = this.getShiftStartEnd(routeItem, shiftKey);
            
            // 确保班次名称、起点、终点都有默认值
            shiftInfoList.push({
                name: shiftConfig?.label || LangHandler.getText('shiftName') + (i+1), // 班次名称兜底
                start: shiftStartEnd.start,
                end: shiftStartEnd.end
            });
        }
        
        return shiftInfoList;
    }
};

// ------------- 增强版DOM渲染层 -------------
var Renderer = {
    updatePageLang: function() {
        // 1. 批量渲染静态文案
        LangHandler.renderAllTexts();
        // 2. 更新动态文案
        this.updateDynamicLangTexts();
        // 3. 更新运营时间面板文案
        this.updateTimetablePanelLang();
        // 4. 更新页面标题
        this.updatePageTitle();
        
        // 额外保障：确保建议列表的空提示文本也能更新
        const emptySuggestTip = document.getElementById('emptySuggestTip');
        const noMatchSuggestTip = document.getElementById('noMatchSuggestTip');
        if (emptySuggestTip) {
            emptySuggestTip.textContent = LangHandler.getText('emptySuggest');
        }
        if (noMatchSuggestTip) {
            noMatchSuggestTip.textContent = LangHandler.getText('noMatchSuggest');
        }
    },


    // 更新页面标题（多语言适配）
    updatePageTitle: function() {
        const titleElement = document.querySelector('title');
        if (titleElement) {
            titleElement.textContent = LangHandler.getText('appTitle');
        }
        
        // 更新加载页面标题
        const loadingTitle = document.querySelector('.loading-title');
        if (loadingTitle) {
            loadingTitle.textContent = LangHandler.getText('appTitle');
        }
    },

    // 更新动态文案
    updateDynamicLangTexts: function() {
        // 分页信息
        const paginationInfo = document.querySelector('.pagination-info');
        if (paginationInfo && CONFIG.currentRouteData) {
            const validStops = DataHandler.getValidStops(CONFIG.currentRouteData);
            const totalPages = DataHandler.getTotalPages(validStops);
            paginationInfo.textContent = LangHandler.getText('pageLabel', {
                current: CONFIG.currentPage,
                total: totalPages
            });
        }

        // 方向切换按钮
        const directionBtn = document.querySelector('.toggle-direction-btn');
        if (directionBtn && !directionBtn.disabled) {
            const key = CONFIG.currentDirection === "A" ? 'directionA' : 'directionB';
            directionBtn.textContent = LangHandler.getText(key);
        }

        // 更新版本信息文本
        const versionElements = document.querySelectorAll('.app-version');
        versionElements.forEach(el => {
            if (el.textContent.includes('BETA')) {
                el.textContent = el.textContent.replace(LangHandler.getText('appVersion'));
            }
        });
    },

    // 更新运营时间面板语言
    updateTimetablePanelLang: function() {
        const timetablePanel = document.getElementById('timetablePanel');
        if (!timetablePanel) return;
        
        timetablePanel.querySelectorAll('[data-lang-key]').forEach(el => {
            const key = el.getAttribute('data-lang-key');
            // 获取元素上的route占位符并替换
            const replacements = {
                route: CONFIG.currentRouteNum || ''
            };
            if (el.tagName === 'INPUT') {
                el.setAttribute('placeholder', LangHandler.getText(key, replacements));
            } else {
                el.textContent = LangHandler.getText(key, replacements);
            }
        });
        
        // 更新发车间隔单位
        timetablePanel.querySelectorAll('.slot-interval').forEach(el => {
            const intervalText = el.textContent.trim();
            if (intervalText) {
                el.innerHTML = `${intervalText} <span style="font-weight:normal; color:#888;">${LangHandler.getText('minutesPerTrip')}</span>`;
            }
        });
    },

    initKeyboardValidity: function(currentInput) {
        var currentInputUpper = (currentInput || '').toString().toUpperCase().trim();
        var validRoutes = DataHandler.getValidRouteNums();
        
        var mainKeys = document.querySelectorAll('.main-num-key');
        var subLetterBtns = document.querySelectorAll('.sub-letter-btn');
        
        if (!mainKeys || mainKeys.length === 0) {
            console.warn('数字键盘元素未找到，请检查 .main-num-key 类名是否正确');
        }
        if (!subLetterBtns || subLetterBtns.length === 0) {
            console.warn('字母键盘元素未找到，请检查 .sub-letter-btn 类名是否正确');
        }
        
        // 立即禁用所有按钮（移除延迟）
        if (mainKeys.length > 0) {
            mainKeys.forEach(function(key) {
                key.disabled = true;
                key.style.opacity = CONFIG.keyboardOpacityDisabled;
                key.onclick = function() {
                    const input = document.getElementById('routeNumberInput');
                    if (input) {
                        input.value += this.getAttribute('data-key');
                        input.dispatchEvent(new Event('input')); // 触发input事件
                    }
                };
            });
        }
        
        if (subLetterBtns.length > 0) {
            subLetterBtns.forEach(function(btn) {
                btn.disabled = true;
                btn.style.opacity = CONFIG.keyboardOpacityDisabled;
                btn.onclick = function() {
                    const input = document.getElementById('routeNumberInput');
                    if (input) {
                        input.value += this.getAttribute('data-key');
                        input.dispatchEvent(new Event('input')); // 触发input事件
                    }
                };
            });
        }
        
        // 空输入时启用所有首字符匹配的按钮
        if (!currentInputUpper) {
            var firstChars = new Set();
            validRoutes.forEach(function(route) {
                if (route.length > 0) {
                    firstChars.add(route.charAt(0));
                }
            });
            
            if (mainKeys.length > 0) {
                mainKeys.forEach(function(key) {
                    var keyValue = key.getAttribute('data-key');
                    if (firstChars.has(keyValue)) {
                        key.disabled = false;
                        key.style.opacity = CONFIG.keyboardOpacityEnabled;
                    }
                });
            }
            
            if (subLetterBtns.length > 0) {
                subLetterBtns.forEach(function(btn) {
                    var btnValue = btn.getAttribute('data-key');
                    if (firstChars.has(btnValue)) {
                        btn.disabled = false;
                        btn.style.opacity = CONFIG.keyboardOpacityEnabled;
                    }
                });
            }
            return;
        }
        
        // 非空输入时启用下一个字符匹配的按钮
        var matchedRoutes = DataHandler.getMatchedRoutePrefixes(currentInputUpper);
        if (matchedRoutes.length === 0) return;
        
        var nextChars = new Set();
        matchedRoutes.forEach(function(route) {
            if (route.length > currentInputUpper.length) {
                var nextChar = route.charAt(currentInputUpper.length);
                nextChars.add(nextChar);
            }
        });
        
        if (mainKeys.length > 0) {
            mainKeys.forEach(function(key) {
                var keyValue = key.getAttribute('data-key');
                if (nextChars.has(keyValue)) {
                    key.disabled = false;
                    key.style.opacity = CONFIG.keyboardOpacityEnabled;
                }
            });
        }
        
        if (subLetterBtns.length > 0) {
            subLetterBtns.forEach(function(btn) {
                var btnValue = btn.getAttribute('data-key');
                if (nextChars.has(btnValue)) {
                    btn.disabled = false;
                    btn.style.opacity = CONFIG.keyboardOpacityEnabled;
                }
            });
        }

        // 添加删除/清空按钮事件
        const deleteBtn = document.getElementById('keyboardDeleteBtn');
        const clearBtn = document.getElementById('keyboardClearBtn');
        const input = document.getElementById('routeNumberInput');
        
        if (deleteBtn && input) {
            deleteBtn.onclick = function() {
                if (input.value.length > 0) {
                    input.value = input.value.substring(0, input.value.length - 1);
                    input.dispatchEvent(new Event('input'));
                    input.dispatchEvent(new Event('change'));
                }
            };
        }
        
        if (clearBtn && input) {
            clearBtn.onclick = function() {
                input.value = '';
                input.dispatchEvent(new Event('input'));
                input.dispatchEvent(new Event('change'));
            };
        }
        
        // 修复按钮禁用状态
        if (deleteBtn) {
            deleteBtn.disabled = !currentInput || currentInput.length === 0;
            deleteBtn.style.opacity = deleteBtn.disabled ? CONFIG.keyboardOpacityDisabled : CONFIG.keyboardOpacityEnabled;
        }
        
        if (clearBtn) {
            clearBtn.disabled = !currentInput || currentInput.length === 0;
            clearBtn.style.opacity = clearBtn.disabled ? CONFIG.keyboardOpacityDisabled : CONFIG.keyboardOpacityEnabled;
        }

    },

    renderRouteSuggestions: function(currentInput) {
        var suggestList = document.getElementById('suggestList');
        
        if (!suggestList) return;
        suggestList.innerHTML = '';

        var currentInputUpper = (currentInput || '').toString().toUpperCase().trim();
        var matchedRoutes = DataHandler.getMatchedRoutePrefixes(currentInputUpper);
        
        if (!matchedRoutes || matchedRoutes.length === 0) {
            var emptyItem = document.createElement('div');
            emptyItem.className = 'suggest-item empty-suggest';
            emptyItem.style.textAlign = 'center';
            emptyItem.style.padding = '20px';
            emptyItem.style.color = '#999';
            emptyItem.textContent = currentInputUpper 
                ? LangHandler.getText('noMatchSuggest') 
                : LangHandler.getText('emptySuggest');
            emptyItem.id = currentInputUpper ? 'noMatchSuggestTip' : 'emptySuggestTip';
            emptyItem.setAttribute('data-lang-key', currentInputUpper ? 'noMatchSuggest' : 'emptySuggest');
            suggestList.appendChild(emptyItem);
            return;
        }
        
        matchedRoutes.forEach(function(routeNum) {
            try {
                var routeItem = DataHandler.getRouteByNum(routeNum);
                if (!routeItem) return;
                
                var suggestItem = document.createElement('div');
                suggestItem.className = 'suggest-item';
                suggestItem.setAttribute('data-route', routeNum);
                
                // 多语言线路名称适配（仅显示线路名称，不重复显示线路号）
                var routeName = CONFIG.currentLang === 'zh-CN' 
                    ? (routeItem.name || routeItem.routeNameCn || routeNum)
                    : (routeItem.routeNameEn || routeItem.name || routeNum);
                
                // 获取所有班次的起终点信息（确保完整）
                var allShiftsInfo = [];
                if (typeof DataHandler.getAllShiftsStartEndInfo === 'function') {
                    allShiftsInfo = DataHandler.getAllShiftsStartEndInfo(routeItem);
                }
                
                // 构建班次信息HTML（修复问题1：移除所有多余的线路号拼接）
                var shiftsHtml = '';
                if (allShiftsInfo.length > 0) {
                    shiftsHtml += '<div class="suggest-shift-list">';
                    allShiftsInfo.forEach(function(shiftInfo, index) {
                        // 核心修复：仅显示班次名称 + 起终点，不添加任何线路号
                        shiftsHtml += `
                            <div class="suggest-shift-item">
                                <span class="suggest-shift-name">${shiftInfo.name}</span>
                                <span class="suggest-shift-route">${shiftInfo.start} → ${shiftInfo.end}</span>
                            </div>
                        `;
                    });
                    shiftsHtml += '</div>';
                } else {
                    // 无班次信息时显示默认文本
                    shiftsHtml = `<div class="suggest-shift-empty">${LangHandler.getText('noShiftInformation')}</div>`;
                }
                
                // 构建最终的按钮HTML（彻底移除重复的线路编号，修复问题1）
                suggestItem.innerHTML = `
                    <div class="suggest-route-header">
                        <span class="suggest-route-name">${routeName || LangHandler.getText('noInformation')}</span>
                        ${routeItem.routeType ? `<span class="suggest-route-type">${routeItem.routeType}</span>` : ''}
                    </div>
                    ${shiftsHtml}
                `;
                
                suggestItem.addEventListener('click', function() {
                    CONFIG.currentRouteNum = routeNum;
                    CONFIG.currentPage = 1;
                    CONFIG.currentDirection = "A";
                    Renderer.renderStopPage(routeNum);
                });
                
                suggestList.appendChild(suggestItem);
            } catch (e) {
                console.error('渲染线路建议项失败:', routeNum, e);
            }
        });
    },

// 渲染站点页面 - 重点修复标题渲染部分
renderStopPage: function(routeNum) {
    var stopContainer = document.getElementById('stopContainer');
    var stopPageTitle = document.getElementById('stopPageTitle');
    if (!stopContainer || !stopPageTitle) return;
    
    document.getElementById('inputScreen').classList.add('hidden');
    document.getElementById('stopScreen').classList.remove('hidden');
    stopContainer.innerHTML = '';
    
    var routeItem = DataHandler.getRouteByNum(routeNum);
    if (!routeItem) {
        stopContainer.innerHTML = `<div class="empty-tip">${CONFIG.emptyTipText[CONFIG.currentLang]}</div>`;
        // 修复：确保占位符替换生效，使用正确的默认值
        stopPageTitle.textContent = LangHandler.getText('stopPageTitleWithRoute', {
            route: LangHandler.getText('unknownRoute')
        });
        return;
    };
    
    // 核心修复：明确传递route参数，确保占位符替换
    stopPageTitle.textContent = LangHandler.getText('stopPageTitleWithRoute', {
        route: routeItem.route // 双重保障，确保有值
    });
    
    CONFIG.currentRouteData = routeItem;
    CONFIG.enabledShifts = DataHandler.getEnabledShifts(routeItem);
    
    var routeInfoBar = this.renderRouteInfoBar(routeItem);
    stopContainer.appendChild(routeInfoBar);
    
    var directionPaginationWrap = this.renderDirectionPagination(routeItem);
    stopContainer.appendChild(directionPaginationWrap);
    
    this.renderStopList(routeItem);
    this.renderShiftLines(routeItem);
    this.updatePageLang();
},


    // 生成单条连贯的班次线条
    renderShiftLines: function(routeItem) {
        if (!routeItem || CONFIG.enabledShifts.length === 0) return;
        
        CONFIG.enabledShifts.forEach(function(shiftKey) {
            var inRangeStops = DataHandler.getShiftInRangeStops(routeItem, shiftKey);
            if (inRangeStops.length === 0) return;
            
            var shiftConfig = DataHandler.getShiftConfig(routeItem, shiftKey);
            var shiftColor = shiftConfig.color;
            
            var allShiftSeqElements = document.querySelectorAll(`.single-shift-seq-wrap[data-shift-key="${shiftKey}"]`);
            allShiftSeqElements.forEach(function(el) {
                el.style.setProperty('--shift-color', shiftColor);
            });
            
            var firstStopSeq = inRangeStops[0].seq;
            var lastStopSeq = inRangeStops[inRangeStops.length - 1].seq;
            
            var firstStopEl = document.querySelector(`.single-shift-seq-wrap[data-shift-key="${shiftKey}"][data-stop-seq="${firstStopSeq}"]`);
            var lastStopEl = document.querySelector(`.single-shift-seq-wrap[data-shift-key="${shiftKey}"][data-stop-seq="${lastStopSeq}"]`);
            
            if (!firstStopEl || !lastStopEl) return;
            
            var shiftContainer = firstStopEl.closest('.multi-shift-seq-wrap');
            if (!shiftContainer) return;
            
            var containerRect = shiftContainer.getBoundingClientRect();
            var firstStopRect = firstStopEl.getBoundingClientRect();
            var lastStopRect = lastStopEl.getBoundingClientRect();
            
            var shiftStartTop = firstStopRect.top - containerRect.top + (firstStopRect.height / 2);
            var shiftEndBottom = containerRect.height - (lastStopRect.top - containerRect.top + lastStopRect.height / 2);
            
            firstStopEl.classList.add('shift-in-range-container');
            firstStopEl.style.setProperty('--shift-start-top', `${shiftStartTop}px`);
            firstStopEl.style.setProperty('--shift-end-bottom', `${shiftEndBottom}px`);
            firstStopEl.style.setProperty('--shift-color', shiftColor);
        });
    },

// 渲染路线信息栏 - 适配新UI
renderRouteInfoBar: function(routeItem) {
    var routeInfoBar = document.createElement('div');
    routeInfoBar.className = 'route-info-bar';

    // 循环线添加特殊类名
    if (routeItem.bound && routeItem.bound.indexOf("C") !== -1) {
        routeInfoBar.classList.add('ring-line');
    }

    // 基础信息区域（路线号 + 班次标签 + 运营时间按钮）
    var routeBasicInfo = document.createElement('div');
    routeBasicInfo.className = 'route-basic-info';

    // 路线号和颜色块
    var routeNumColorWrap = document.createElement('div');
    routeNumColorWrap.className = 'route-num-color-wrap';

    var routeNum = document.createElement('div');
    routeNum.className = 'route-num';
    routeNum.textContent = routeItem.route;

    routeNumColorWrap.appendChild(routeNum);

    // 班次标签容器
    var shiftTags = document.createElement('div');
    shiftTags.className = 'route-shift-tags';

    // 添加启用的班次标签
    var enabledShifts = DataHandler.getEnabledShifts(routeItem);
    enabledShifts.forEach(function(shiftKey, index) {
        var shiftConfig = DataHandler.getShiftConfig(routeItem, shiftKey);
        var shiftTag = document.createElement('div');
        shiftTag.className = 'shift-tag';
        
        // 根据班次类型添加样式类
        if (shiftKey === 'normal') {
            shiftTag.classList.add('tag-normal');
        } else if (shiftKey === 'special1') {
            shiftTag.classList.add('tag-special1');
        } else if (shiftKey === 'special2') {
            shiftTag.classList.add('tag-special2');
        } else if (shiftKey === 'special3') {
            shiftTag.classList.add('tag-special3');
        }

        // 现代图标搭配
        const shiftIcons = {
            'normal': '🚌',
            'special1': '🚨',
            'special2': '🚦',
            'special3': '🌟'
        };
        
        shiftTag.innerHTML = `
            <span class="shift-icon">${shiftIcons[shiftKey] || '🚌'}</span>
            <span class="shift-text">${shiftConfig.label}</span>
        `;
        
        shiftTags.appendChild(shiftTag);
    });

    // 运营时间按钮
    var timetableBtn = document.createElement('button');
    timetableBtn.className = 'timetable-btn';
    timetableBtn.setAttribute('data-lang-key', 'timetableBtn');
    timetableBtn.innerHTML = `
        <span class="timetable-icon">⏰</span>
        <span class="timetable-text">${LangHandler.getText('timetableBtn')}</span>
    `;
    timetableBtn.addEventListener('click', function() {
        Renderer.renderTimetablePanel(routeItem);
    });

    // 组装基础信息区域
    routeBasicInfo.appendChild(routeNumColorWrap);
    routeBasicInfo.appendChild(shiftTags);
    routeBasicInfo.appendChild(timetableBtn);

    // 路线详情区域（全新网格布局）
    var routeDetails = document.createElement('div');
    routeDetails.className = 'route-details';

    // 1. 行驶方向
    var startEnd = DataHandler.getDirectionStartEndStops(routeItem);
    var directionItem = document.createElement('div');
    directionItem.className = 'detail-item';
    
    directionItem.innerHTML = `
        <div class="detail-icon">🧭</div>
        <div class="detail-content">
            <div class="detail-label">${LangHandler.getText('driveDirection')}</div>
            <div class="detail-value">${startEnd.first} → ${startEnd.last}</div>
        </div>
    `;
    routeDetails.appendChild(directionItem);

    // 2. 途经方向
    var viaItem = document.createElement('div');
    viaItem.className = 'detail-item';
    
    var viaText = CONFIG.currentLang === 'zh-CN' 
        ? (routeItem.viaDirectionCn || LangHandler.getText('noInformation'))
        : (routeItem.viaDirectionEn || routeItem.viaDirectionCn || LangHandler.getText('noInformation'));
    
    viaItem.innerHTML = `
        <div class="detail-icon">📍</div>
        <div class="detail-content">
            <div class="detail-label">${LangHandler.getText('viaDirection')}</div>
            <div class="detail-value">${viaText}</div>
        </div>
    `;
    routeDetails.appendChild(viaItem);

    // 3. 线路类型
    var typeItem = document.createElement('div');
    typeItem.className = 'detail-item';
    
    var typeText = CONFIG.currentLang === 'zh-CN' 
        ? (routeItem.routeType || LangHandler.getText('noInformation'))
        : (routeItem.routeTypeEn || routeItem.routeType || LangHandler.getText('noInformation'));
    
    typeItem.innerHTML = `
        <div class="detail-icon">🚏</div>
        <div class="detail-content">
            <div class="detail-label">${LangHandler.getText('routeType')}</div>
            <div class="detail-value">${typeText}</div>
        </div>
    `;
    routeDetails.appendChild(typeItem);

    // 组装完整的路线信息栏
    routeInfoBar.appendChild(routeBasicInfo);
    routeInfoBar.appendChild(routeDetails);

    return routeInfoBar;
},

    // 渲染方向切换和分页控件
    renderDirectionPagination: function(routeItem) {
        var wrap = document.createElement('div');
        wrap.className = 'direction-pagination-wrap';
        
        var directionBtn = document.createElement('button');
        directionBtn.className = 'toggle-direction-btn';
        
        var supportSwitch = DataHandler.isRouteSupportDirectionSwitch(routeItem);
        directionBtn.disabled = !supportSwitch;
        
        directionBtn.textContent = LangHandler.getText(CONFIG.currentDirection === "A" ? 'directionA' : 'directionB');
        
        directionBtn.addEventListener('click', function() {
            CONFIG.currentDirection = CONFIG.currentDirection === "A" ? "B" : "A";
            CONFIG.currentPage = 1;
            
            Renderer.renderStopPage(routeItem.route);
        });
        
        var paginationControl = document.createElement('div');
        paginationControl.className = 'pagination-control';
        
        var prevBtn = document.createElement('button');
        prevBtn.className = 'pagination-btn prev-btn';
        prevBtn.setAttribute('data-lang-key', 'prevPage');
        prevBtn.textContent = LangHandler.getText('prevPage');
        
        var nextBtn = document.createElement('button');
        nextBtn.className = 'pagination-btn next-btn';
        nextBtn.setAttribute('data-lang-key', 'nextPage');
        nextBtn.textContent = LangHandler.getText('nextPage');
        
        var paginationInfo = document.createElement('div');
        paginationInfo.className = 'pagination-info';
        paginationInfo.setAttribute('data-lang-key', 'pageLabel');
        
        var validStops = DataHandler.getValidStops(routeItem);
        var totalPages = DataHandler.getTotalPages(validStops);
        
        paginationInfo.textContent = LangHandler.getText('pageLabel', {
            current: CONFIG.currentPage,
            total: totalPages
        });
        
        prevBtn.disabled = CONFIG.currentPage <= 1;
        nextBtn.disabled = CONFIG.currentPage >= totalPages;
        
        prevBtn.addEventListener('click', function() {
            if (CONFIG.currentPage > 1) {
                CONFIG.currentPage--;
                Renderer.renderStopPage(routeItem.route);
            }
        });
        
        nextBtn.addEventListener('click', function() {
            if (CONFIG.currentPage < totalPages) {
                CONFIG.currentPage++;
                Renderer.renderStopPage(routeItem.route);
            }
        });
        
        paginationControl.appendChild(prevBtn);
        paginationControl.appendChild(paginationInfo);
        paginationControl.appendChild(nextBtn);
        
        wrap.appendChild(directionBtn);
        wrap.appendChild(paginationControl);
        
        return wrap;
    },

    // 渲染站点列表
    renderStopList: function(routeItem) {
        var stopContainer = document.getElementById('stopContainer');
        if (!stopContainer) return;
        
        var validStops = DataHandler.getValidStops(routeItem);
        if (validStops.length === 0) {
            var emptyTip = document.createElement('div');
            emptyTip.className = 'empty-tip';
            emptyTip.textContent = CONFIG.emptyTipText[CONFIG.currentLang];
            stopContainer.appendChild(emptyTip);
            return;
        }
        
        var pageStops = DataHandler.getStopsByPage(validStops, CONFIG.currentPage);
        
        var columnStops = DataHandler.splitStopsToColumns(pageStops);
        
        var stopWrap = document.createElement('div');
        stopWrap.className = 'stop-wrap';
        
        var table = document.createElement('table');
        table.className = 'stop-table';
        
        var thead = document.createElement('thead');
        var headerRow = document.createElement('tr');
        
        var seqHeader = document.createElement('th');
        seqHeader.setAttribute('data-lang-key', 'stopNumber');
        seqHeader.textContent = LangHandler.getText('stopNumber');
        headerRow.appendChild(seqHeader);
        
        var nameHeader = document.createElement('th');
        nameHeader.setAttribute('data-lang-key', 'stopName');
        nameHeader.textContent = LangHandler.getText('stopName');
        headerRow.appendChild(nameHeader);
        
        thead.appendChild(headerRow);
        table.appendChild(thead);
        
        var tbody = document.createElement('tbody');
        
        columnStops.leftStops.forEach(function(stop) {
            var row = this.renderStopRow(stop, routeItem);
            tbody.appendChild(row);
        }.bind(this));
        
        columnStops.rightStops.forEach(function(stop) {
            var row = this.renderStopRow(stop, routeItem);
            tbody.appendChild(row);
        }.bind(this));
        
        table.appendChild(tbody);
        stopWrap.appendChild(table);
        stopContainer.appendChild(stopWrap);
    },

    // 渲染单个站点行 - 修复：站点名称显示规则 + 副站名小字显示
    renderStopRow: function(stop, routeItem) {
        var row = document.createElement('tr');
        row.className = 'stop-row-visible';
        
        var seqCell = document.createElement('td');
        
        var multiShiftSeqWrap = document.createElement('div');
        multiShiftSeqWrap.className = 'multi-shift-seq-wrap';
        
        CONFIG.enabledShifts.forEach(function(shiftKey) {
            var shiftConfig = DataHandler.getShiftConfig(routeItem, shiftKey);
            var shiftLocalSeq = DataHandler.getShiftLocalSeq(routeItem, stop, shiftKey);
            
            var singleShiftSeqWrap = document.createElement('div');
            singleShiftSeqWrap.className = 'single-shift-seq-wrap';
            if (!shiftLocalSeq) {
                singleShiftSeqWrap.classList.add('no-seq');
            }
            if (!DataHandler.isStopInShiftRange(routeItem, stop, shiftKey)) {
                singleShiftSeqWrap.classList.add('shift-out-of-range');
            }
            singleShiftSeqWrap.setAttribute('data-shift-key', shiftKey);
            singleShiftSeqWrap.setAttribute('data-stop-seq', stop.seq);
            
            var shiftLine = document.createElement('div');
            shiftLine.className = 'shift-line';
            
            var seqText = document.createElement('div');
            seqText.className = 'shift-seq-text';
            seqText.textContent = shiftLocalSeq || '';
            
            if (DataHandler.isShiftStartStop(routeItem, stop, shiftKey)) {
                singleShiftSeqWrap.classList.add('shift-start-stop');
                seqText.classList.add('start-stop-text');
            }
            if (DataHandler.isShiftEndStop(routeItem, stop, shiftKey)) {
                singleShiftSeqWrap.classList.add('shift-end-stop');
                seqText.classList.add('start-stop-text');
            }
            
            singleShiftSeqWrap.style.setProperty('--shift-color', shiftConfig.color);
            seqText.style.color = shiftConfig.color;
            
            singleShiftSeqWrap.appendChild(shiftLine);
            singleShiftSeqWrap.appendChild(seqText);
            multiShiftSeqWrap.appendChild(singleShiftSeqWrap);
        });
        
        seqCell.appendChild(multiShiftSeqWrap);
        row.appendChild(seqCell);

        var nameCell = document.createElement('td');
        
        var nameContainer = document.createElement('div');
        nameContainer.className = 'stop-name-container';

        // 副站名小字显示，紧跟主站名
        if (CONFIG.currentLang === 'zh-CN') {
            // 中文版：主站名 + 副站名（括号，小字）
            var mainName = document.createElement('span');
            mainName.className = 'stop-main-name';
            // 移除^^但保留原数据
            mainName.textContent = (stop.nameCn || LangHandler.getText('noInformation')).replace(/\^\^/g, '');
            
            // 标记转折点
            if ((stop.nameCn && stop.nameCn.includes('^^')) || (stop.nameEn && stop.nameEn.includes('^^'))) {
                var turningPointTag = document.createElement('span');
                turningPointTag.className = 'turning-point-tag';
                turningPointTag.textContent = '（转折点）';
                turningPointTag.style.color = '#e53e3e';
                turningPointTag.style.fontWeight = '600';
                turningPointTag.style.marginLeft = '8px';
                mainName.appendChild(turningPointTag);
            }
            
            // 副站名紧跟主站名
            if (stop.nameSubCn) {
                var subName = document.createElement('span');
                subName.className = 'stop-sub-name';
                subName.textContent = `（${stop.nameSubCn}）`;
                mainName.appendChild(subName);
            }
            
            nameContainer.appendChild(mainName);
            
            // 英文名称（单独行，更小）
            if (stop.nameEn) {
                var enName = document.createElement('div');
                enName.className = 'stop-english-name';
                enName.textContent = stop.nameEn.replace(/\^\^/g, '');
                if (stop.nameSubEn) {
                    enName.textContent += ` (${stop.nameSubEn})`;
                }
                nameContainer.appendChild(enName);
            }
        } else {
            // 英文版：英文主站名 + 副站名（括号，小字）
            var mainName = document.createElement('span');
            mainName.className = 'stop-main-name';
            mainName.textContent = (stop.nameEn || stop.nameCn || LangHandler.getText('noInformation')).replace(/\^\^/g, '');
            
            // 标记转折点
            if ((stop.nameCn && stop.nameCn.includes('^^')) || (stop.nameEn && stop.nameEn.includes('^^'))) {
                var turningPointTag = document.createElement('span');
                turningPointTag.className = 'turning-point-tag';
                turningPointTag.textContent = ' (Turning Point)';
                turningPointTag.style.color = '#e53e3e';
                turningPointTag.style.fontWeight = '600';
                turningPointTag.style.marginLeft = '8px';
                mainName.appendChild(turningPointTag);
            }
            
            // 副站名紧跟主站名
            if (stop.nameSubEn) {
                var subName = document.createElement('span');
                subName.className = 'stop-sub-name';
                subName.textContent = ` (${stop.nameSubEn})`;
                mainName.appendChild(subName);
            } else if (stop.nameSubCn) {
                // 备用显示中文副站名
                var subName = document.createElement('span');
                subName.className = 'stop-sub-name';
                subName.textContent = ` (${stop.nameSubCn})`;
                mainName.appendChild(subName);
            }
            
            nameContainer.appendChild(mainName);
        }

        // 临时关闭标签
        if (stop.tempClose) {
            var tempTag = document.createElement('div');
            tempTag.className = 'temp-close-tag';
            tempTag.setAttribute('data-lang-key', 'tempClose');
            tempTag.textContent = LangHandler.getText('tempClose');
            nameContainer.appendChild(tempTag);
            
            if (stop.tempCloseReason) {
                var reason = document.createElement('div');
                reason.className = 'temp-close-reason';
                reason.innerHTML = `<span data-lang-key="tempCloseReason">${LangHandler.getText('tempCloseReason')}</span>${stop.tempCloseReason}`;
                nameContainer.appendChild(reason);
            }
        }
        
        nameCell.appendChild(nameContainer);
        row.appendChild(nameCell);
        
        return row;
    },

    // 渲染运营时间面板（核心修复：标题显示路线号码）
    renderTimetablePanel: function(routeItem, direction = null) {
        // 移除已存在的面板
        var existingPanel = document.getElementById('timetablePanel');
        if (existingPanel) {
            existingPanel.remove();
        }
        
        var timetableData = DataHandler.getTimetableData(routeItem, direction);
        if (!timetableData) {
            alert(LangHandler.getText('emptyTimetable'));
            return;
        }
        
        // 禁止页面滚动
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.width = '100%';
        
        // 创建面板的基础结构
        var panel = document.createElement('div');
        panel.id = 'timetablePanel';
        panel.className = 'timetable-panel';
        
        // 创建面板内容容器
        var panelContent = document.createElement('div');
        panelContent.className = 'timetable-panel-content';
        
        // 设置线路颜色变量
        panelContent.style.setProperty('--route-color', routeItem.color || '#4a90e2');
        panelContent.style.setProperty('--primary-dark', routeItem.color ? 
            this.darkenColor(routeItem.color, 10) : '#3a80d2');
        
        // 面板头部
        var panelHeader = document.createElement('div');
        panelHeader.className = 'timetable-panel-header';
        
        var panelTitle = document.createElement('div');
        panelTitle.className = 'panel-title';
        panelTitle.setAttribute('data-lang-key', 'operationTime');
        
        // ========== 核心修复：使用LangHandler原生的占位符替换 ==========
        // 直接传入route参数进行占位符替换
        panelTitle.textContent = LangHandler.getText('operationTime', {
            route: routeItem.route
        });
        
        panelHeader.appendChild(panelTitle);
        
        var closeBtn = document.createElement('button');
        closeBtn.className = 'close-panel-btn';
        closeBtn.innerHTML = '&times;';
        closeBtn.addEventListener('click', function() {
            // 恢复页面滚动
            document.body.style.overflow = '';
            document.body.style.position = '';
            document.body.style.width = '';
            panel.remove();
        });
        panelHeader.appendChild(closeBtn);
        
        panelContent.appendChild(panelHeader);
        
        // 方向切换区域
        var directionWrap = document.createElement('div');
        directionWrap.className = 'timetable-direction-wrap';
        
        // 方向标签
        var directionLabel = document.createElement('div');
        directionLabel.className = 'timetable-direction-label';
        var directionText = timetableData.direction === "A" ? LangHandler.getText('outbound') : 
                        timetableData.direction === "B" ? LangHandler.getText('inbound') : 
                        LangHandler.getText('loop');
        directionLabel.textContent = `${LangHandler.getText('direction')}: ${directionText}`;
        directionWrap.appendChild(directionLabel);
        
        // 切换方向按钮
        if (timetableData.hasOtherDirection) {
            var switchDirectionBtn = document.createElement('button');
            switchDirectionBtn.className = 'switch-timetable-direction-btn';
            var newDirection = timetableData.direction === "A" ? "B" : "A";
            var newDirectionText = newDirection === "A" ? LangHandler.getText('outbound') : LangHandler.getText('inbound');
            switchDirectionBtn.textContent = `${LangHandler.getText('switchTo')} ${newDirectionText}`;
            switchDirectionBtn.addEventListener('click', function() {
                Renderer.renderTimetablePanel(routeItem, newDirection);
            });
            directionWrap.appendChild(switchDirectionBtn);
        }
        
        panelContent.appendChild(directionWrap);
        
        // 运营时间内容容器
        var timetableContent = document.createElement('div');
        timetableContent.className = 'timetable-content';
        
        // 确保能显示所有类型的时间数据
        if (typeof timetableData.data === 'string' || (timetableData.data && timetableData.data.text)) {
            var emptyTip = document.createElement('div');
            emptyTip.className = 'empty-tip';
            emptyTip.textContent = timetableData.data.text || timetableData.data || LangHandler.getText('noTimetableData');
            timetableContent.appendChild(emptyTip);
        } else if (timetableData.data && Object.keys(timetableData.data).length > 0) {
            // 创建更健壮的时间表表格
            for (var key in timetableData.data) {
                if (['text', 'direction', 'hasOtherDirection'].includes(key)) continue;
                
                // 创建班次卡片
                var shiftCard = document.createElement('div');
                shiftCard.className = 'timetable-shift-card';
                shiftCard.style.setProperty('--shift-color', routeItem.color || '#4a90e2');
                
                // 处理班次数据
                if (typeof timetableData.data[key] === 'object' && !Array.isArray(timetableData.data[key])) {
                    var shiftTitle = document.createElement('div');
                    shiftTitle.className = 'shift-title-cell';
                    shiftTitle.textContent = key === 'normal' ? LangHandler.getText('normalShift') : 
                                           key.startsWith('special') ? LangHandler.getText(`specialShift${key.replace('special', '')}`) : 
                                           key;
                    shiftCard.appendChild(shiftTitle);
                    
                    var timetableTable = document.createElement('table');
                    timetableTable.className = 'timetable-table';
                    
                    // 处理班次内的具体数据
                    var shiftData = timetableData.data[key];
                    for (var shiftKey in shiftData) {
                        if (shiftKey === 'interval' && Array.isArray(shiftData[shiftKey])) {
                            // 处理发车间隔
                            var intervalRow = document.createElement('tr');
                            
                            var intervalLabelCell = document.createElement('td');
                            intervalLabelCell.className = 'timetable-label-cell';
                            intervalLabelCell.setAttribute('data-lang-key', 'intervalTitle');
                            intervalLabelCell.textContent = LangHandler.getText('intervalTitle');
                            
                            var intervalValueCell = document.createElement('td');
                            intervalValueCell.className = 'timetable-value-cell';
                            intervalValueCell.innerHTML = '<ul class="interval-list"></ul>';
                            
                            intervalRow.appendChild(intervalLabelCell);
                            intervalRow.appendChild(intervalValueCell);
                            timetableTable.appendChild(intervalRow);
                            
                            // 渲染间隔列表
                            var intervalList = intervalValueCell.querySelector('.interval-list');
                            shiftData[shiftKey].forEach(function(interval) {
                                if (interval.time && interval.interval) {
                                    var li = document.createElement('li');
                                    li.innerHTML = `
                                        <span class="time-slot">${interval.time}</span>
                                        <span class="interval-value">${interval.interval} ${LangHandler.getText('minutesPerTrip')}</span>
                                    `;
                                    intervalList.appendChild(li);
                                }
                            });
                        } else if (shiftData[shiftKey]) {
                            // 处理首末班时间
                            var row = document.createElement('tr');
                            
                            var labelCell = document.createElement('td');
                            labelCell.className = 'timetable-label-cell';
                            var labelKey = shiftKey === 'firstTime' ? 'firstBus' : 
                                          shiftKey === 'lastTime' ? 'lastBus' : 
                                          shiftKey === 'interval' ? 'intervalTitle' : shiftKey;
                            labelCell.setAttribute('data-lang-key', labelKey);
                            labelCell.textContent = LangHandler.getText(labelKey) || shiftKey;
                            
                            var valueCell = document.createElement('td');
                            valueCell.className = 'timetable-value-cell';
                            valueCell.innerHTML = `<strong>${shiftData[shiftKey] || LangHandler.getText('noInformation')}</strong>`;
                            
                            row.appendChild(labelCell);
                            row.appendChild(valueCell);
                            timetableTable.appendChild(row);
                        }
                    }
                    
                    shiftCard.appendChild(timetableTable);
                } else if (timetableData.data[key]) {
                    var timetableTable = document.createElement('table');
                    timetableTable.className = 'timetable-table';
                    
                    var row = document.createElement('tr');
                    
                    var labelCell = document.createElement('td');
                    labelCell.className = 'timetable-label-cell';
                    var labelKey = key === 'firstBus' ? 'firstBus' : 
                                key === 'lastBus' ? 'lastBus' : 
                                key === 'interval' ? 'intervalTitle' : key;
                    labelCell.setAttribute('data-lang-key', labelKey);
                    labelCell.textContent = LangHandler.getText(labelKey) || key;
                    
                    var valueCell = document.createElement('td');
                    valueCell.className = 'timetable-value-cell';
                    valueCell.innerHTML = `<strong>${timetableData.data[key] || LangHandler.getText('noInformation')}</strong>`;
                    
                    row.appendChild(labelCell);
                    row.appendChild(valueCell);
                    timetableTable.appendChild(row);
                    
                    shiftCard.appendChild(timetableTable);
                }
                
                // 只有卡片有内容时才添加
                if (shiftCard.children.length > 0) {
                    timetableContent.appendChild(shiftCard);
                }
            }
        } else {
            // 无数据时显示空提示
            var emptyTip = document.createElement('div');
            emptyTip.className = 'empty-tip';
            emptyTip.textContent = LangHandler.getText('noTimetableData');
            timetableContent.appendChild(emptyTip);
        }
        
        panelContent.appendChild(timetableContent);
        panel.appendChild(panelContent);
        
        // 添加到页面
        document.getElementById('stopScreen').appendChild(panel);
        
        // 更新面板语言（确保占位符生效）
        this.updateTimetablePanelLang();
    },

    // 辅助函数：加深颜色
    darkenColor: function(color, percent) {
        if (!color || !/^#([0-9A-F]{3}|[0-9A-F]{6})$/i.test(color)) {
            return '#3a80d2';
        }
        percent = Math.max(0, Math.min(100, percent || 10));
        
        color = color.replace(/^#/, '');
        if (color.length === 3) {
            color = color.split('').map(c => c + c).join('');
        }
        
        var r = parseInt(color.substr(0, 2), 16);
        var g = parseInt(color.substr(2, 2), 16);
        var b = parseInt(color.substr(4, 2), 16);
        
        r = Math.max(0, Math.round(r * (100 - percent) / 100));
        g = Math.max(0, Math.round(g * (100 - percent) / 100));
        b = Math.max(0, Math.round(b * (100 - percent) / 100));
        
        var nr = r.toString(16).padStart(2, '0');
        var ng = g.toString(16).padStart(2, '0');
        var nb = b.toString(16).padStart(2, '0');
        
        return `#${nr}${ng}${nb}`;
    },
    
    // 渲染更新日志
    renderUpdateLog: function() {
        // 修正容器ID，确保指向正确的元素
        var logPanel = document.getElementById('updateLogPanel');
        if (!logPanel) return;
        
        logPanel.innerHTML = '';
        
        // 清空原有内容，重新创建结构
        var logHeader = document.createElement('div');
        logHeader.className = 'log-header';
        
        var logTitle = document.createElement('div');
        logTitle.className = 'log-title';
        logTitle.textContent = LangHandler.getText('updateLog');
        logHeader.appendChild(logTitle);
        
        logPanel.appendChild(logHeader);
        
        // 确保从updatelog.js获取数据
        if (typeof updateLogData !== 'undefined' && updateLogData && updateLogData.logs) {
            var logList = document.createElement('div');
            logList.className = 'log-list';
            logPanel.appendChild(logList);
            
            // 遍历更新日志数据
            updateLogData.logs.forEach(function(logItem) {
                var logItemEl = document.createElement('div');
                logItemEl.className = 'log-item';
                
                var logItemHeader = document.createElement('div');
                logItemHeader.className = 'log-item-header';
                
                var version = document.createElement('div');
                version.className = 'log-item-version';
                version.textContent = `${LangHandler.getText('logVersion')} ${logItem.version}`;
                logItemHeader.appendChild(version);
                
                var time = document.createElement('div');
                time.className = 'log-item-time';
                time.textContent = logItem.time || logItem.updateTime || LangHandler.getText('noInformation');
                logItemHeader.appendChild(time);
                
                logItemEl.appendChild(logItemHeader);
                
                // 日志标题
                var logItemTitle = document.createElement('div');
                logItemTitle.className = 'log-item-title';
                logItemTitle.textContent = logItem.title || LangHandler.getText('logUpdateContent');
                logItemEl.appendChild(logItemTitle);
                
                // 分类内容容器
                var contentCategories = document.createElement('div');
                contentCategories.className = 'log-content-categories';
                
                // 处理分类内容
                var content = logItem.content || {};
                
                // 定义分类顺序和样式
                var categories = [
                    { key: 'added', className: 'log-category-added' },
                    { key: 'fixed', className: 'log-category-fixed' },
                    { key: 'removed', className: 'log-category-removed' },
                    { key: 'revamped', className: 'log-category-revamped' },
                    { key: 'improvements', className: 'log-category-improvements' }
                ];
                
                // 渲染每个分类
                categories.forEach(function(category) {
                    if (content[category.key] && content[category.key].length > 0) {
                        var categoryWrap = document.createElement('div');
                        categoryWrap.className = `log-category ${category.className}`;
                        
                        // 分类标题
                        var categoryTitle = document.createElement('div');
                        categoryTitle.className = 'log-category-title';
                        categoryTitle.textContent = LangHandler.getText(`log${category.key.charAt(0).toUpperCase() + category.key.slice(1)}`) || 
                                                  category.key.charAt(0).toUpperCase() + category.key.slice(1);
                        categoryWrap.appendChild(categoryTitle);
                        
                        // 分类列表
                        var categoryList = document.createElement('ul');
                        categoryList.className = 'log-category-list';
                        
                        content[category.key].forEach(function(item) {
                            var li = document.createElement('li');
                            li.textContent = item;
                            categoryList.appendChild(li);
                        });
                        
                        categoryWrap.appendChild(categoryList);
                        contentCategories.appendChild(categoryWrap);
                    }
                });
                
                logItemEl.appendChild(contentCategories);
                logList.appendChild(logItemEl);
            });
        } else {
            // 无更新日志数据时显示提示
            var emptyLog = document.createElement('div');
            emptyLog.className = 'empty-log-tip';
            emptyLog.textContent = LangHandler.getText('noUpdateLog');
            logPanel.appendChild(emptyLog);
        }
        
        // 添加版本信息
        var logFooter = document.createElement('div');
        logFooter.className = 'log-footer';
        
        logPanel.appendChild(logFooter);
    },
    
    // 初始化页面加载
    initPageLoad: function() {
        // 初始化语言
        LangHandler.renderAllTexts();
        
        // 初始化页面事件
        PageController.initPageEvents();
        
        // 修复4：确保DOM完全加载后初始化键盘
        const input = document.getElementById('routeNumberInput');
        if (input) {
            // 修复5：使用防抖函数优化输入事件
            const debouncedInputHandler = debounce(function() {
                Renderer.initKeyboardValidity(this.value);
                Renderer.renderRouteSuggestions(this.value);
            }, 100);
            
            input.addEventListener('input', debouncedInputHandler);
            
            // 修复6：添加键盘按钮点击后的输入同步
            input.addEventListener('change', function() {
                Renderer.initKeyboardValidity(this.value);
                Renderer.renderRouteSuggestions(this.value);
            });
            
            // 确保页面加载完成后初始化键盘
            setTimeout(() => {
                Renderer.initKeyboardValidity('');
                Renderer.renderRouteSuggestions('');
            }, 300);
        } else {
            console.warn('线路编号输入框未找到，请检查 ID: routeNumberInput');
        }
        
        // 页面加载完成后的初始化
        window.addEventListener('load', function() {
            // 确保所有DOM元素加载完成
            setTimeout(() => {
                Renderer.updatePageLang();
                // 再次初始化键盘，确保元素已加载
                if (input) {
                    Renderer.initKeyboardValidity(input.value);
                }
                console.log('页面初始化完成，当前语言：', CONFIG.currentLang);
            }, 500);
        });
    }

};

// ------------- 全局初始化 -------------
// 页面加载完成后初始化所有功能
document.addEventListener('DOMContentLoaded', function() {
    try {
        // 初始化渲染器
        Renderer.initPageLoad();
        
        // 确保语言切换按钮的初始状态正确
        const zhBtn = document.getElementById('switchZhBtn');
        const enBtn = document.getElementById('switchEnBtn');
        
        if (zhBtn && enBtn) {
            if (CONFIG.currentLang === 'zh-CN') {
                zhBtn.classList.add('active');
                enBtn.classList.remove('active');
            } else {
                enBtn.classList.add('active');
                zhBtn.classList.remove('active');
            }
        }
        
        console.log('应用初始化完成');
    } catch (error) {
        console.error('应用初始化失败:', error);
        // 初始化失败时的兜底处理
        alert(LangHandler.getText('initFailed'));
    }
});

// ------------- 全局错误处理 -------------
window.addEventListener('error', function(e) {
    console.error('全局错误捕获:', e.message, e.filename, e.lineno);
    // 可以在这里添加错误上报逻辑
});

// ------------- 工具函数 -------------
// 防抖函数
function debounce(func, wait = 200) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            func.apply(this, args);
        }, wait);
    };
}

// 节流函数
function throttle(func, limit = 300) {
    let lastCall = 0;
    return function(...args) {
        const now = Date.now();
        if (now - lastCall >= limit) {
            lastCall = now;
            func.apply(this, args);
        }
    };
}

// 格式化日期（多语言适配）
function formatDate(date, format = 'YYYY-MM-DD') {
    if (!date) date = new Date();
    if (typeof date === 'string') date = new Date(date);
    
    const lang = CONFIG.currentLang;
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    
    // 月份名称（多语言）
    const monthNames = {
        'zh-CN': ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
        'en-US': ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    };
    
    // 星期名称（多语言）
    const weekNames = {
        'zh-CN': ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
        'en-US': ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    };
    
    let result = format;
    result = result.replace('YYYY', year);
    result = result.replace('MM', month);
    result = result.replace('DD', day);
    result = result.replace('HH', hours);
    result = result.replace('mm', minutes);
    result = result.replace('ss', seconds);
    result = result.replace('MMMM', monthNames[lang][date.getMonth()]);
    result = result.replace('ddd', weekNames[lang][date.getDay()]);
    
    return result;
}

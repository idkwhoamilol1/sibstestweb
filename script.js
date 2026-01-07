// ------------- 全局配置常量 -------------
var CONFIG = {
    singleColumnSize: 10,
    pageSize: 20,
    currentPage: 1,
    currentDirection: "A",
    currentRouteNum: "",
    currentRouteData: null,
    enabledShifts: [],
    loadingTime: 1000,
    keyboardOpacityDisabled: '0.5',
    keyboardOpacityEnabled: '1',
    emptyTipText: '暂无站点数据',
    suggestTimeout: null
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
        if (!routeNum) return null;
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

    // 获取班次配置（名称/颜色）
    getShiftConfig: function(routeItem, shiftKey) {
        if (!routeItem || !shiftKey || !routeItem.shiftConfig) {
            return {
                label: shiftKey === 'normal' ? '常规班次' : '特殊班次' + shiftKey.replace('special', ''),
                color: shiftKey === 'normal' ? '#4a90e2' : '#e53e3e'
            };
        }
        return routeItem.shiftConfig[shiftKey] || {
            label: shiftKey === 'normal' ? '常规班次' : '特殊班次' + shiftKey.replace('special', ''),
            color: '#4a90e2'
        };
    },

    // 获取班次的起止站点
    getShiftStartEnd: function(routeItem, shiftKey) {
        if (!routeItem || !shiftKey) return { start: "未知起点", end: "未知终点" };
        
        // 强制使用C方向（环线）
        var targetDirection = CONFIG.currentDirection;
        if (routeItem.bound && routeItem.bound.indexOf("C") !== -1) {
            targetDirection = "C";
        }
        
        // 获取该班次在指定方向下的站点
        var shiftStops = [];
        if (routeItem.stops && routeItem.stops[targetDirection]) {
            for (var i = 0; i < routeItem.stops[targetDirection].length; i++) {
                var stop = routeItem.stops[targetDirection][i];
                if (stop.visible && stop.stopFor && stop.stopFor.indexOf(shiftKey) !== -1) {
                    shiftStops.push(stop);
                }
            }
        }
        
        // 排序
        shiftStops.sort(function(a, b) {
            return a.seq - b.seq;
        });
        
        if (shiftStops.length === 0) {
            return { start: "未知起点", end: "未知终点" };
        }
        
        // 环线处理：终点站默认是最后一个seq站点
        if (routeItem.bound && routeItem.bound.indexOf("C") !== -1) {
            return {
                start: shiftStops[0].nameCn || "未知起点",
                end: shiftStops[shiftStops.length - 1].nameCn || shiftStops[0].nameCn || "未知终点"
            };
        }
        
        return {
            start: shiftStops[0].nameCn || "未知起点",
            end: shiftStops[shiftStops.length - 1].nameCn || "未知终点"
        };
    },

    // 获取当前方向下的有效站点
    getValidStops: function(routeItem) {
        if (!routeItem || !routeItem.stops) return [];
        
        // 循环线强制使用C方向
        var targetDirection = CONFIG.currentDirection;
        if (routeItem.bound && routeItem.bound.indexOf("C") !== -1) {
            targetDirection = "C";
            CONFIG.currentDirection = "C";
        }
        
        var directionStops = routeItem.stops[targetDirection] || [];
        var validStops = [];

        // 核心修复：无论是否有启用班次，都显示所有可见站点
        for (var i = 0; i < directionStops.length; i++) {
            var stop = directionStops[i];
            if (stop.visible) {
                validStops.push(stop);
            }
        }

        // 兜底：如果当前方向真的没有数据，遍历所有方向
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

    // 获取当前方向下的首尾站点（用于方向栏显示）
    getDirectionStartEndStops: function(routeItem) {
        if (!routeItem) return { first: "未知站点", last: "未知站点" };
        
        // 循环线强制使用C方向
        var targetDirection = CONFIG.currentDirection;
        if (routeItem.bound && routeItem.bound.indexOf("C") !== -1) {
            targetDirection = "C";
        }
        
        var directionStops = routeItem.stops[targetDirection] || [];
        var validStops = [];
        
        // 筛选可见且有班次的站点
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
        
        // 修复：如果无筛选结果，显示所有可见站点
        if (validStops.length === 0) {
            for (var i = 0; i < directionStops.length; i++) {
                var stop = directionStops[i];
                if (stop.visible) {
                    validStops.push(stop);
                }
            }
        }
        
        if (validStops.length === 0) {
            // 降级：尝试其他方向
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
            return { first: "未知站点", last: "未知站点" };
        }
        
        // 排序
        validStops.sort(function(a, b) {
            return a.seq - b.seq;
        });
        
        // 环线处理：终点站是最后一个seq站点
        if (routeItem.bound && routeItem.bound.indexOf("C") !== -1) {
            return {
                first: validStops[0].nameCn || "未知站点",
                last: validStops[validStops.length - 1].nameCn || validStops[0].nameCn || "未知站点"
            };
        }
        
        return {
            first: validStops[0].nameCn || "未知站点",
            last: validStops[validStops.length - 1].nameCn || "未知站点"
        };
    },

    // 判断线路是否支持方向切换（排除循环线）
    isRouteSupportDirectionSwitch: function(routeItem) {
        if (!routeItem) return false;
        
        // 循环线禁用方向切换
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

    // 判断是否是班次终点站（适配环线逻辑）
    isShiftEndStop: function(routeItem, stop, shiftKey) {
        // 环线：终点站=最后一个seq站点
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

    // 获取站点在班次中的本地序号（修复显示问题）
    getShiftLocalSeq: function(routeItem, stop, shiftKey) {
        // 先验证基础数据
        if (!routeItem || !stop || !shiftKey) return "";
        
        // 对于不在班次范围内的站点，返回空
        if (!this.isStopInShiftRange(routeItem, stop, shiftKey)) {
            return "";
        }
        
        // 常规班次直接返回seq
        if (shiftKey === "normal") {
            return stop.seq.toString();
        }
        
        var shiftStops = this.getShiftStopStops(routeItem, shiftKey);
        if (shiftStops.length === 0) return "";
        
        // 精确匹配seq，修复序号计算错误
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

    // 获取匹配的线路前缀（严格限制输入）
    getMatchedRoutePrefixes: function(currentInput) {
        var currentInputUpper = currentInput.toUpperCase().trim();
        var validRoutes = this.getValidRouteNums();
        
        // 无输入时返回所有线路的首字符
        if (!currentInputUpper) {
            var firstChars = {};
            for (var i = 0; i < validRoutes.length; i++) {
                var route = validRoutes[i];
                if (route && route.length > 0) {
                    firstChars[route[0]] = true;
                }
            }
            var charsArray = [];
            for (var char in firstChars) {
                if (firstChars.hasOwnProperty(char)) {
                    charsArray.push(char);
                }
            }
            return charsArray;
        }

        // 有输入时，只返回能构成有效线路前缀的字符
        var matchedRoutes = [];
        for (var j = 0; j < validRoutes.length; j++) {
            if (validRoutes[j].startsWith(currentInputUpper)) {
                matchedRoutes.push(validRoutes[j]);
            }
        }

        var nextChars = {};
        for (var k = 0; k < matchedRoutes.length; k++) {
            var route = matchedRoutes[k];
            if (route.length > currentInputUpper.length) {
                nextChars[route[currentInputUpper.length]] = true;
            }
        }
        
        var nextCharsArray = [];
        for (var c in nextChars) {
            if (nextChars.hasOwnProperty(c)) {
                nextCharsArray.push(c);
            }
        }
        return nextCharsArray;
    },

    // 获取方向文本（适配循环线）
    getDirectionTextByBound: function(boundValue, currentDirection) {
        if (boundValue.indexOf("C") !== -1) {
            return "循环线";
        }
        if (currentDirection === "A") {
            return "去程";
        } else if (currentDirection === "B") {
            return "回程";
        }
        return "未知方向";
    },

    // 获取匹配的线路列表（无输入时显示所有线路）
    getMatchedRoutes: function(currentInput) {
        var currentInputUpper = currentInput.toUpperCase().trim();
        var validRoutes = this.getValidRoutes();
        
        // 无输入时返回所有启用线路
        if (!currentInputUpper) {
            return validRoutes;
        }

        // 有输入时匹配前缀
        var matchedRoutes = [];
        for (var i = 0; i < validRoutes.length; i++) {
            if (validRoutes[i].route.toUpperCase().startsWith(currentInputUpper)) {
                matchedRoutes.push(validRoutes[i]);
            }
        }
        return matchedRoutes;
    },

    // 获取线路运营时间
    getRouteTimetable: function(routeItem) {
        if (!routeItem || !routeItem.timetable) return {};
        return routeItem.timetable;
    },

    // 格式化站点名称
    formatStopName: function(name) {
        if (!name) return '未知站点';
        return name;
    },

    // 验证输入是否为有效线路前缀/完整线路
    isValidRouteInput: function(input) {
        if (!input) return false;
        var inputUpper = input.toUpperCase().trim();
        var validRoutes = this.getValidRouteNums();
        
        // 检查是否是完整线路
        if (validRoutes.includes(inputUpper)) {
            return true;
        }
        
        // 检查是否是有效前缀
        for (var i = 0; i < validRoutes.length; i++) {
            if (validRoutes[i].startsWith(inputUpper)) {
                return true;
            }
        }
        
        return false;
    },

    // 检查站点是否临时暂停
    isStopTempClosed: function(stop) {
        return stop.tempClose === true;
    },

    // 获取临时暂停原因
    getStopTempCloseReason: function(stop) {
        return stop.tempCloseReason || '';
    }
};

// ------------- 视图渲染层 -------------
var Renderer = {
    // 初始化应用
    init: function() {
        this.bindEvents();
        this.showLoadingScreen();
        
        var self = this;
        setTimeout(function() {
            self.hideLoadingScreen();
            self.showFuncScreen();
            self.renderUpdateLogPanel();
            
            // 初始化键盘状态
            var input = document.getElementById('routeNumberInput');
            if (input) {
                self.initKeyboardValidity(input.value);
            }
        }, CONFIG.loadingTime);
        
        var suggestPanel = document.getElementById('routeSuggestPanel');
        if (suggestPanel) {
            suggestPanel.classList.remove('hidden');
            // 初始化显示所有线路
            self.updateRouteSuggestions('');
        }
    },

    // 绑定所有事件
    bindEvents: function() {
        var self = this;
        
        // 功能选择按钮事件
        var routeSelectFunc = document.getElementById('routeSelectFunc');
        if (routeSelectFunc) {
            routeSelectFunc.addEventListener('click', function() {
                self.showInputScreen();
                // 显示所有线路建议
                self.updateRouteSuggestions('');
                
                // 初始化键盘状态
                var input = document.getElementById('routeNumberInput');
                if (input) {
                    self.initKeyboardValidity(input.value);
                }
            });
        }

        // 更新日志按钮事件
        var updateLogFunc = document.getElementById('updateLogFunc');
        if (updateLogFunc) {
            updateLogFunc.addEventListener('click', function() {
                var logPanel = document.getElementById('updateLogPanel');
                if (logPanel) {
                    logPanel.classList.remove('hidden');
                }
            });
        }

        // 关闭更新日志按钮事件
        var closeLogBtn = document.getElementById('closeLogBtn');
        if (closeLogBtn) {
            closeLogBtn.addEventListener('click', function() {
                var logPanel = document.getElementById('updateLogPanel');
                if (logPanel) {
                    logPanel.classList.add('hidden');
                }
            });
        }

        // 返回按钮事件
        var backToFuncBtn = document.getElementById('backToFuncBtn');
        if (backToFuncBtn) {
            backToFuncBtn.addEventListener('click', function() {
                self.showFuncScreen();
                self.clearInput();
            });
        }

        var backToInputBtn = document.getElementById('backToInputBtn');
        if (backToInputBtn) {
            backToInputBtn.addEventListener('click', function() {
                self.showInputScreen();
                CONFIG.currentPage = 1;
                // 显示所有线路建议
                self.updateRouteSuggestions('');
                
                // 初始化键盘状态
                var input = document.getElementById('routeNumberInput');
                if (input) {
                    self.initKeyboardValidity(input.value);
                }
            });
        }

        // 绑定键盘事件
        this.bindKeyboardEvents();
        
        // 全局按钮事件委托
        document.addEventListener('click', function(e) {
            // 运营时间按钮
            if (e.target && e.target.id === 'timetableBtn') {
                self.showTimetablePanel();
            }
            // 关闭运营时间按钮
            if (e.target && e.target.id === 'closeTimetableBtn') {
                self.hideTimetablePanel();
            }
            // 方向切换按钮（修复循环线）
            if (e.target && e.target.id === 'toggleDirectionBtn') {
                // 循环线禁用方向切换
                if (CONFIG.currentRouteData.bound && CONFIG.currentRouteData.bound.indexOf("C") !== -1) {
                    alert('循环线不支持方向切换');
                    return;
                }
                CONFIG.currentDirection = CONFIG.currentDirection === "A" ? "B" : "A";
                CONFIG.currentPage = 1;
                self.renderStopScreen();
                var dirText = DataHandler.getDirectionTextByBound(
                    CONFIG.currentRouteData.bound || "", 
                    CONFIG.currentDirection
                );
                e.target.textContent = '切换至' + (CONFIG.currentDirection === "A" ? "回程" : "去程");
            }
            // 分页按钮事件
            if (e.target && e.target.id === 'firstPageBtn') {
                CONFIG.currentPage = 1;
                self.renderStopScreen();
            }
            if (e.target && e.target.id === 'prevPageBtn') {
                if (CONFIG.currentPage > 1) {
                    CONFIG.currentPage--;
                    self.renderStopScreen();
                }
            }
            if (e.target && e.target.id === 'nextPageBtn') {
                var validStops = DataHandler.getValidStops(CONFIG.currentRouteData);
                var totalPages = DataHandler.getTotalPages(validStops);
                if (CONFIG.currentPage < totalPages) {
                    CONFIG.currentPage++;
                    self.renderStopScreen();
                }
            }
            if (e.target && e.target.id === 'lastPageBtn') {
                var validStops = DataHandler.getValidStops(CONFIG.currentRouteData);
                var totalPages = DataHandler.getTotalPages(validStops);
                CONFIG.currentPage = totalPages;
                self.renderStopScreen();
            }
            // 线路建议项点击事件
            if (e.target && e.target.closest('.suggest-item')) {
                e.preventDefault();
                var suggestItem = e.target.closest('.suggest-item');
                var routeNum = suggestItem.dataset.routeNum;
                
                if (routeNum) {
                    var input = document.getElementById('routeNumberInput');
                    if (input) {
                        input.value = routeNum;
                        self.initKeyboardValidity(routeNum);
                        self.confirmRouteInput();
                    }
                }
            }
        });

        // 输入框事件（严格限制输入）- 优化稳定性
        var routeNumberInput = document.getElementById('routeNumberInput');
        if (routeNumberInput) {
            // 确保输入框始终可交互
            routeNumberInput.removeAttribute('disabled');
            
            // 输入事件：只允许输入有效前缀
            routeNumberInput.addEventListener('input', function(e) {
                clearTimeout(CONFIG.suggestTimeout);
                
                // 过滤无效输入
                var currentValue = e.target.value;
                var validValue = '';
                
                // 逐字符验证，只保留能构成有效前缀的部分
                for (var i = 0; i < currentValue.length; i++) {
                    var tempValue = validValue + currentValue[i];
                    if (DataHandler.isValidRouteInput(tempValue)) {
                        validValue = tempValue;
                    } else {
                        break;
                    }
                }
                
                // 更新输入框值
                e.target.value = validValue;
                
                // 立即更新建议列表和键盘状态
                self.updateRouteSuggestions(validValue);
                self.initKeyboardValidity(validValue);
            });

            // 回车事件
            routeNumberInput.addEventListener('keydown', function(e) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    self.confirmRouteInput();
                }
            });

            // 粘贴事件：过滤无效内容
            routeNumberInput.addEventListener('paste', function(e) {
                e.preventDefault();
                var pastedText = (e.clipboardData || window.clipboardData).getData('text');
                if (!pastedText) return;
                
                // 只保留有效前缀部分
                var validValue = '';
                for (var i = 0; i < pastedText.length; i++) {
                    var tempValue = validValue + pastedText[i];
                    if (DataHandler.isValidRouteInput(tempValue)) {
                        validValue = tempValue;
                    } else {
                        break;
                    }
                }
                
                if (validValue) {
                    routeNumberInput.value = validValue;
                    self.updateRouteSuggestions(validValue);
                    self.initKeyboardValidity(validValue);
                }
            });

            // 输入框获得焦点时立即更新键盘状态
            routeNumberInput.addEventListener('focus', function() {
                self.initKeyboardValidity(this.value);
                // 确保键盘面板可见
                var keyboard = document.getElementById('customKeyboard');
                if (keyboard) keyboard.classList.remove('hidden');
            });
            
            // 输入框失去焦点时仍保持键盘可见
            routeNumberInput.addEventListener('blur', function() {
                var keyboard = document.getElementById('customKeyboard');
                if (keyboard) keyboard.classList.remove('hidden');
            });
        }
    },

    // 绑定键盘按钮事件（严格限制输入）- 优化稳定性
    bindKeyboardEvents: function() {
        var self = this;
        var keyButtons = document.querySelectorAll('.main-num-key, .sub-letter-btn');
        
        // 确保键盘按钮都能被正确绑定
        if (keyButtons.length === 0) {
            // 延迟重试绑定
            setTimeout(function() {
                self.bindKeyboardEvents();
            }, 100);
            return;
        }
        
        for (var i = 0; i < keyButtons.length; i++) {
            (function(btn) {
                btn.addEventListener('click', function() {
                    var key = btn.dataset.key;
                    if (!key || btn.disabled) return;
                    
                    var input = document.getElementById('routeNumberInput');
                    if (!input) return;
                    
                    var currentValue = input.value;
                    var newInput = currentValue + key;
                    
                    // 仅当新输入是有效前缀/完整线路时才允许输入
                    if (DataHandler.isValidRouteInput(newInput)) {
                        input.value = newInput;
                        self.updateRouteSuggestions(input.value);
                        self.initKeyboardValidity(input.value);
                    }
                });
            })(keyButtons[i]);
        }

        // 功能按键事件
        var keyboardDeleteBtn = document.getElementById('keyboardDeleteBtn');
        if (keyboardDeleteBtn) {
            keyboardDeleteBtn.addEventListener('click', function() {
                var input = document.getElementById('routeNumberInput');
                if (input) {
                    input.value = input.value.slice(0, -1);
                    self.updateRouteSuggestions(input.value);
                    self.initKeyboardValidity(input.value);
                }
            });
        }

        var keyboardClearBtn = document.getElementById('keyboardClearBtn');
        if (keyboardClearBtn) {
            keyboardClearBtn.addEventListener('click', function() {
                self.clearInput();
            });
        }

        var keyboardConfirmBtn = document.getElementById('keyboardConfirmBtn');
        if (keyboardConfirmBtn) {
            keyboardConfirmBtn.addEventListener('click', function() {
                self.confirmRouteInput();
            });
        }
    },

    // 渲染更新日志面板
    renderUpdateLogPanel: function() {
        if (typeof updateLogData === 'undefined') return;
        
        var logTitle = document.getElementById('logTitle');
        var logVersion = document.getElementById('logVersion');
        var logTime = document.getElementById('logTime');
        var logList = document.getElementById('logList');
        
        if (logTitle) logTitle.textContent = updateLogData.title || '版本更新日志';
        if (logVersion) logVersion.textContent = updateLogData.version || 'v1.0.0';
        if (logTime) logTime.textContent = updateLogData.updateTime || '';
        
        if (logList && updateLogData.logs && updateLogData.logs.length > 0) {
            logList.innerHTML = '';
            
            for (var i = 0; i < updateLogData.logs.length; i++) {
                var log = updateLogData.logs[i];
                var logItem = document.createElement('div');
                logItem.className = 'log-item';
                
                var logHeader = document.createElement('div');
                logHeader.className = 'log-item-header';
                
                var logVer = document.createElement('div');
                logVer.className = 'log-item-version';
                logVer.textContent = log.version || '';
                
                var logTime = document.createElement('div');
                logTime.className = 'log-item-time';
                logTime.textContent = log.time || '';
                
                logHeader.appendChild(logVer);
                logHeader.appendChild(logTime);
                
                var logTitle = document.createElement('div');
                logTitle.className = 'log-item-title';
                logTitle.textContent = log.title || '';
                
                var logContent = document.createElement('div');
                logContent.className = 'log-item-content';
                
                if (log.content && log.content.length > 0) {
                    for (var j = 0; j < log.content.length; j++) {
                        var li = document.createElement('li');
                        li.textContent = log.content[j];
                        logContent.appendChild(li);
                    }
                }
                
                logItem.appendChild(logHeader);
                logItem.appendChild(logTitle);
                logItem.appendChild(logContent);
                
                logList.appendChild(logItem);
            }
        }
    },

    // 初始化键盘按钮可用性（严格限制）- 优化稳定性
    initKeyboardValidity: function(currentInput) {
        // 确保DOM元素已加载
        var keyButtons = document.querySelectorAll('.main-num-key, .sub-letter-btn');
        if (keyButtons.length === 0) {
            setTimeout(function() {
                Renderer.initKeyboardValidity(currentInput);
            }, 50);
            return;
        }
        
        var currentInputUpper = currentInput.toUpperCase().trim();
        var matchedPrefixes = DataHandler.getMatchedRoutePrefixes(currentInputUpper);
        
        for (var i = 0; i < keyButtons.length; i++) {
            var btn = keyButtons[i];
            var key = btn.dataset.key;
            if (!key) continue;
            
            // 仅当按键是匹配的前缀字符时启用
            if (matchedPrefixes.includes(key.toUpperCase())) {
                btn.disabled = false;
                btn.style.opacity = CONFIG.keyboardOpacityEnabled;
            } else {
                btn.disabled = true;
                btn.style.opacity = CONFIG.keyboardOpacityDisabled;
            }
        }
        
        // 功能按钮状态控制
        var deleteBtn = document.getElementById('keyboardDeleteBtn');
        var clearBtn = document.getElementById('keyboardClearBtn');
        var confirmBtn = document.getElementById('keyboardConfirmBtn');
        
        if (deleteBtn) {
            deleteBtn.disabled = currentInputUpper.length === 0;
            deleteBtn.style.opacity = deleteBtn.disabled ? CONFIG.keyboardOpacityDisabled : CONFIG.keyboardOpacityEnabled;
        }
        
        if (clearBtn) {
            clearBtn.disabled = currentInputUpper.length === 0;
            clearBtn.style.opacity = clearBtn.disabled ? CONFIG.keyboardOpacityDisabled : CONFIG.keyboardOpacityEnabled;
        }
        
        if (confirmBtn) {
            // 仅当输入是完整线路时启用确认按钮
            var validRoutes = DataHandler.getValidRouteNums();
            confirmBtn.disabled = !validRoutes.includes(currentInputUpper);
            confirmBtn.style.opacity = confirmBtn.disabled ? CONFIG.keyboardOpacityDisabled : CONFIG.keyboardOpacityEnabled;
        }
    },

    // 更新线路建议列表
    updateRouteSuggestions: function(currentInput) {
        var suggestList = document.getElementById('suggestList');
        if (!suggestList) return;
        
        var matchedRoutes = DataHandler.getMatchedRoutes(currentInput);
        
        if (matchedRoutes.length === 0) {
            suggestList.innerHTML = '<div class="empty-tip">' + CONFIG.emptyTipText + '</div>';
            return;
        }
        
        suggestList.innerHTML = '';
        
        for (var i = 0; i < matchedRoutes.length; i++) {
            var route = matchedRoutes[i];
            var suggestItem = document.createElement('div');
            suggestItem.className = 'suggest-item';
            suggestItem.dataset.routeNum = route.route;
            
            var routeNum = document.createElement('div');
            routeNum.className = 'suggest-route-num';
            routeNum.textContent = route.route;
            
            var shiftList = document.createElement('div');
            shiftList.className = 'suggest-shift-list';
            
            // 获取启用的班次
            var enabledShifts = DataHandler.getEnabledShifts(route);
            for (var j = 0; j < enabledShifts.length; j++) {
                var shiftKey = enabledShifts[j];
                var shiftConfig = DataHandler.getShiftConfig(route, shiftKey);
                var shiftStartEnd = DataHandler.getShiftStartEnd(route, shiftKey);
                
                var shiftItem = document.createElement('div');
                shiftItem.className = 'suggest-shift-item';
                
                var shiftName = document.createElement('div');
                shiftName.className = 'suggest-shift-name';
                shiftName.textContent = shiftConfig.label;
                
                var shiftRoute = document.createElement('div');
                shiftRoute.className = 'suggest-shift-route';
                shiftRoute.textContent = shiftStartEnd.start + ' → ' + shiftStartEnd.end;
                
                shiftItem.appendChild(shiftName);
                shiftItem.appendChild(shiftRoute);
                shiftList.appendChild(shiftItem);
            }
            
            suggestItem.appendChild(routeNum);
            suggestItem.appendChild(shiftList);
            suggestList.appendChild(suggestItem);
        }
    },

    // 清空输入
    clearInput: function() {
        var input = document.getElementById('routeNumberInput');
        if (input) {
            input.value = '';
            this.updateRouteSuggestions('');
            this.initKeyboardValidity('');
        }
    },

    // 确认线路输入
    confirmRouteInput: function() {
        var input = document.getElementById('routeNumberInput');
        if (!input) return;
        
        var routeNum = input.value.trim().toUpperCase();
        if (!routeNum) {
            alert('请输入有效的线路编号');
            return;
        }
        
        var routeData = DataHandler.getRouteByNum(routeNum);
        if (!routeData) {
            alert('未找到该线路信息，请检查输入');
            return;
        }
        
        CONFIG.currentRouteNum = routeNum;
        CONFIG.currentRouteData = routeData;
        CONFIG.enabledShifts = DataHandler.getEnabledShifts(routeData);
        CONFIG.currentPage = 1;
        
        // 循环线强制使用C方向
        if (routeData.bound && routeData.bound.indexOf("C") !== -1) {
            CONFIG.currentDirection = "C";
        } else {
            CONFIG.currentDirection = "A";
        }
        
        this.showStopScreen();
        this.renderStopScreen();
    },

    // 渲染站点页面
    renderStopScreen: function() {
        var stopContainer = document.getElementById('stopContainer');
        if (!stopContainer || !CONFIG.currentRouteData) return;
        
        var routeData = CONFIG.currentRouteData;
        var validStops = DataHandler.getValidStops(routeData);
        var pageStops = DataHandler.getStopsByPage(validStops, CONFIG.currentPage);
        var splitStops = DataHandler.splitStopsToColumns(pageStops);
        
        var totalPages = DataHandler.getTotalPages(validStops);
        var directionStartEnd = DataHandler.getDirectionStartEndStops(routeData);
        var isSupportDirectionSwitch = DataHandler.isRouteSupportDirectionSwitch(routeData);
        
        // 构建页面HTML
        var html = '';
        
        // 线路信息栏（添加循环线标识）
        var isRingLine = routeData.bound && routeData.bound.indexOf("C") !== -1;
        html += '<div class="route-info-bar ' + (isRingLine ? 'ring-line' : '') + '">';
        html += '<div class="route-basic-info">';
        html += '<div class="route-num-color-wrap">';
        html += '<div class="route-color-block" style="background-color: ' + (routeData.color || '#4a90e2') + '"></div>';
        html += '<div class="route-num">' + routeData.route + '</div>';
        html += '</div>';
        
        // 班次标签
        html += '<div class="route-shift-tags">';
        for (var i = 0; i < CONFIG.enabledShifts.length; i++) {
            var shiftKey = CONFIG.enabledShifts[i];
            var shiftConfig = DataHandler.getShiftConfig(routeData, shiftKey);
            var tagClass = shiftKey === 'normal' ? 'tag-normal' : 
                          shiftKey === 'special1' ? 'tag-special1' : 
                          shiftKey === 'special2' ? 'tag-special2' : 'tag-special3';
            
            // 循环线班次标签特殊样式
            if (isRingLine) {
                tagClass += ' ring-line-tag';
            }
            
            html += '<span class="shift-tag ' + tagClass + '" style="background-color: ' + shiftConfig.color + '">' + shiftConfig.label + '</span>';
        }
        html += '</div>';
        
        // 运营时间按钮
        html += '<button id="timetableBtn" class="timetable-btn">运营时间</button>';
        html += '</div>';
        
        // 线路方向信息
        html += '<div class="route-dest-container">';
        var dirText = DataHandler.getDirectionTextByBound(routeData.bound || "", CONFIG.currentDirection);
        html += '<div class="dest-dir ' + (isRingLine ? 'ring-line' : '') + '"><span class="label">行驶方向：</span>' + dirText + '</div>';
        html += '<div class="dest-dir"><span class="label">站点范围：</span>' + directionStartEnd.first + ' → ' + directionStartEnd.last + '</div>';
        
        if (routeData.viaDirectionCn) {
            html += '<div class="via-direction-cn"><span class="label">途经：</span>' + routeData.viaDirectionCn + '</div>';
        }
        if (routeData.viaDirectionEn) {
            html += '<div class="via-direction-en"><span class="label">Via：</span>' + routeData.viaDirectionEn + '</div>';
        }
        if (routeData.routeType) {
            html += '<div class="route-type"><span class="label">线路类型：</span>' + routeData.routeType + '</div>';
        }
        html += '</div>';
        html += '</div>';
        
        // 方向切换 + 分页容器
        html += '<div class="direction-pagination-wrap">';
        html += '<button id="toggleDirectionBtn" class="toggle-direction-btn" ' + (isSupportDirectionSwitch ? '' : 'disabled') + '>';
        html += '切换至' + (CONFIG.currentDirection === "A" ? "回程" : "去程");
        html += '</button>';
        
        html += '<div class="pagination-control">';
        html += '<button id="firstPageBtn" class="pagination-btn" ' + (CONFIG.currentPage === 1 ? 'disabled' : '') + '>首页</button>';
        html += '<button id="prevPageBtn" class="pagination-btn" ' + (CONFIG.currentPage === 1 ? 'disabled' : '') + '>上一页</button>';
        html += '<span class="pagination-info">第<span>' + CONFIG.currentPage + '</span>页 / 共<span>' + totalPages + '</span>页</span>';
        html += '<button id="nextPageBtn" class="pagination-btn" ' + (CONFIG.currentPage === totalPages ? 'disabled' : '') + '>下一页</button>';
        html += '<button id="lastPageBtn" class="pagination-btn" ' + (CONFIG.currentPage === totalPages ? 'disabled' : '') + '>末页</button>';
        html += '</div>';
        html += '</div>';
        
        // 站点列表
        html += '<div class="stop-wrap">';
        html += '<table class="stop-table">';
        html += '<thead>';
        html += '<tr>';
        html += '<th>班次序号</th>'; // 班次序号列（居右）
        html += '<th>站点名称</th>'; // 站点名称列（居左）
        html += '</tr>';
        html += '</thead>';
        html += '<tbody>';
        
        // 左侧站点列表
        if (splitStops.leftStops && splitStops.leftStops.length > 0) {
            for (var i = 0; i < splitStops.leftStops.length; i++) {
                var stop = splitStops.leftStops[i];
                html += this.renderStopRow(stop, routeData);
            }
        }
        
        // 右侧站点列表
        if (splitStops.rightStops && splitStops.rightStops.length > 0) {
            for (var i = 0; i < splitStops.rightStops.length; i++) {
                var stop = splitStops.rightStops[i];
                html += this.renderStopRow(stop, routeData);
            }
        }
        
        // 空数据提示
        if (validStops.length === 0) {
            html += '<tr>';
            html += '<td colspan="2" style="text-align: center; padding: 40px; color: #999;">';
            html += CONFIG.emptyTipText;
            html += '</td>';
            html += '</tr>';
        }
        
        html += '</tbody>';
        html += '</table>';
        html += '</div>';
        
        stopContainer.innerHTML = html;
        
        // 更新页面标题
        var stopPageTitle = document.getElementById('stopPageTitle');
        if (stopPageTitle) {
            stopPageTitle.textContent = routeData.route + ' 线路站点信息';
        }
        
        // 更新方向切换按钮文本
        var toggleDirectionBtn = document.getElementById('toggleDirectionBtn');
        if (toggleDirectionBtn) {
            toggleDirectionBtn.textContent = '切换至' + (CONFIG.currentDirection === "A" ? "回程" : "去程");
            toggleDirectionBtn.disabled = !isSupportDirectionSwitch;
        }
    },

    // 渲染单个站点行（核心修复：班次序号显示、不停站样式、线条连接）
    renderStopRow: function(stop, routeData) {
        if (!stop) return '';
        
        var rowHtml = '';
        rowHtml += '<tr class="stop-row-visible">';
        
        // 班次序号列（居右）
        rowHtml += '<td>';
        rowHtml += '<div class="multi-shift-seq-wrap">';
        
        // 为每个启用的班次渲染序号
        for (var i = 0; i < CONFIG.enabledShifts.length; i++) {
            var shiftKey = CONFIG.enabledShifts[i];
            var shiftConfig = DataHandler.getShiftConfig(routeData, shiftKey);
            var shiftLocalSeq = DataHandler.getShiftLocalSeq(routeData, stop, shiftKey);
            
            // 判断站点状态
            var isInShiftRange = DataHandler.isStopInShiftRange(routeData, stop, shiftKey);
            var isStartStop = DataHandler.isShiftStartStop(routeData, stop, shiftKey);
            var isEndStop = DataHandler.isShiftEndStop(routeData, stop, shiftKey);
            
            // 样式类
            var seqClass = 'single-shift-seq-wrap';
            if (!isInShiftRange) {
                seqClass += ' shift-out-of-range'; // 不停站-灰色外框
            } else if (isStartStop && isEndStop) {
                seqClass += ' shift-start-end-stop'; // 环线起点+终点
            } else if (isStartStop) {
                seqClass += ' shift-start-stop'; // 起点
            } else if (isEndStop) {
                seqClass += ' shift-end-stop'; // 终点
            }
            
            // 渲染序号容器
            rowHtml += '<div class="' + seqClass + '" style="--shift-color: ' + shiftConfig.color + '">';
            rowHtml += '<span class="shift-seq-text">' + (shiftLocalSeq || '') + '</span>';
            rowHtml += '</div>';
        }
        
        rowHtml += '</div>';
        rowHtml += '</td>';
        
        // 站点名称列（居左）- 主名黑色、副名灰色
        rowHtml += '<td>';
        rowHtml += '<div class="stop-name-container">';
        rowHtml += '<span class="stop-name-main">' + DataHandler.formatStopName(stop.nameCn) + '</span>';
        
        // 副站名（灰色小字）
        if (stop.nameSubCn) {
            rowHtml += '<span class="stop-name-sub">' + stop.nameSubCn + '</span>';
        }
        
        // 临时暂停标签
        if (DataHandler.isStopTempClosed(stop)) {
            rowHtml += '<span class="temp-close-tag">临时暂停</span>';
            var closeReason = DataHandler.getStopTempCloseReason(stop);
            if (closeReason) {
                rowHtml += '<div class="temp-close-reason">原因：' + closeReason + '</div>';
            }
        }
        
        rowHtml += '</div>';
        
        // 英文名称
        if (stop.nameEn) {
            rowHtml += '<div class="stop-name-en">' + stop.nameEn;
            // 英文副站名（灰色小字）
            if (stop.nameSubEn) {
                rowHtml += ' <span class="stop-name-sub">' + stop.nameSubEn + '</span>';
            }
            rowHtml += '</div>';
        }
        
        rowHtml += '</td>';
        rowHtml += '</tr>';
        
        return rowHtml;
    },

    // 显示运营时间面板
    showTimetablePanel: function() {
        if (!CONFIG.currentRouteData) return;
        
        var timetable = DataHandler.getRouteTimetable(CONFIG.currentRouteData);
        var panelHtml = '';
        
        panelHtml += '<div class="timetable-panel">';
        panelHtml += '<div class="timetable-content">';
        panelHtml += '<div class="timetable-header">';
        panelHtml += '<h3>' + CONFIG.currentRouteData.route + ' 运营时间</h3>';
        panelHtml += '<button id="closeTimetableBtn" class="close-timetable-btn">×</button>';
        panelHtml += '</div>';
        
        // 运营时间内容
        if (Object.keys(timetable).length === 0) {
            panelHtml += '<div class="empty-tip">暂无运营时间信息</div>';
        } else {
            for (var shiftKey in timetable) {
                if (timetable.hasOwnProperty(shiftKey) && CONFIG.enabledShifts.includes(shiftKey)) {
                    var shiftConfig = DataHandler.getShiftConfig(CONFIG.currentRouteData, shiftKey);
                    var shiftTime = timetable[shiftKey];
                    
                    panelHtml += '<div class="timetable-shift" style="border-left-color: ' + shiftConfig.color + '">';
                    panelHtml += '<h4 style="color: ' + shiftConfig.color + '">' + shiftConfig.label + '</h4>';
                    
                    // 首末班时间
                    if (shiftTime.firstTime || shiftTime.lastTime) {
                        panelHtml += '<p>';
                        panelHtml += '<span>首班车</span>';
                        panelHtml += '<span>' + (shiftTime.firstTime || '暂无') + '</span>';
                        panelHtml += '</p>';
                        panelHtml += '<p>';
                        panelHtml += '<span>末班车</span>';
                        panelHtml += '<span>' + (shiftTime.lastTime || '暂无') + '</span>';
                        panelHtml += '</p>';
                    }
                    
                    // 发车间隔
                    if (shiftTime.interval && shiftTime.interval.length > 0) {
                        panelHtml += '<p>';
                        panelHtml += '<span>发车间隔</span>';
                        panelHtml += '</p>';
                        panelHtml += '<ul class="time-slots-list">';
                        
                        for (var i = 0; i < shiftTime.interval.length; i++) {
                            var slot = shiftTime.interval[i];
                            panelHtml += '<li>';
                            panelHtml += '<span class="slot-time">' + slot.time + '</span>';
                            panelHtml += '<span class="slot-interval">' + slot.interval + '</span>';
                            panelHtml += '</li>';
                        }
                        
                        panelHtml += '</ul>';
                    }
                    
                    panelHtml += '</div>';
                }
            }
        }
        
        panelHtml += '</div>';
        panelHtml += '</div>';
        
        // 添加到body
        document.body.insertAdjacentHTML('beforeend', panelHtml);
    },

    // 隐藏运营时间面板
    hideTimetablePanel: function() {
        var panel = document.querySelector('.timetable-panel');
        if (panel) {
            panel.remove();
        }
    },

    // 显示加载页面
    showLoadingScreen: function() {
        this.hideAllScreens();
        var screen = document.getElementById('loadingScreen');
        if (screen) screen.classList.remove('hidden');
    },

    // 隐藏加载页面
    hideLoadingScreen: function() {
        var screen = document.getElementById('loadingScreen');
        if (screen) screen.classList.add('hidden');
    },

    // 显示功能选择页面
    showFuncScreen: function() {
        this.hideAllScreens();
        var screen = document.getElementById('funcScreen');
        if (screen) screen.classList.remove('hidden');
    },

    // 显示输入页面
    showInputScreen: function() {
        this.hideAllScreens();
        var screen = document.getElementById('inputScreen');
        if (screen) screen.classList.remove('hidden');
        
        // 确保键盘可见
        var keyboard = document.getElementById('customKeyboard');
        if (keyboard) keyboard.classList.remove('hidden');
    },

    // 显示站点页面
    showStopScreen: function() {
        this.hideAllScreens();
        var screen = document.getElementById('stopScreen');
        if (screen) screen.classList.remove('hidden');
    },

    // 隐藏所有页面
    hideAllScreens: function() {
        var screens = document.querySelectorAll('.screen');
        for (var i = 0; i < screens.length; i++) {
            screens[i].classList.add('hidden');
        }
    }
};

// ------------- 初始化应用 -------------
document.addEventListener('DOMContentLoaded', function() {
    Renderer.init();
});
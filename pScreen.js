// ------------- 第一步：全局配置（集中管理可修改参数）-------------
const CONFIG = {
    singleColumnSize: 10, // 单栏站点数量
    pageSize: 20, // 每页总站点数量（左10+右10）
    currentPage: 1,
    currentDirection: "A",
    currentRouteNum: "",
    currentRouteData: null,
    enabledShifts: [] // 启用的班次类型
};

// ------------- 第二步：数据处理层（核心保留：特殊班次序号重排 + 始发/终点判断）-------------
const DataHandler = {
    // 获取有效线路（启用状态）
    getValidRoutes() {
        return routeData.data.filter(item => item.enabled === true);
    },

    // 获取所有有效线路编号的集合
    getValidRouteNums() {
        return this.getValidRoutes().map(item => item.route.toUpperCase());
    },

    // 根据线路编号获取线路详情
    getRouteByNum(routeNum) {
        if (!routeNum) return null;
        return this.getValidRoutes().find(item => item.route.toUpperCase() === routeNum.toUpperCase());
    },

    // 获取启用的班次类型
    getEnabledShifts(routeItem) {
        if (!routeItem || !routeItem.shifts) return [];
        const shifts = [];
        for (const [key, value] of Object.entries(routeItem.shifts)) {
            if (value === true) {
                shifts.push(key);
            }
        }
        return shifts;
    },

    // 过滤有效站点（可见+对应班次停靠）
    getValidStops(routeItem) {
        if (!routeItem || !routeItem.stops) return [];
        const enabledShifts = CONFIG.enabledShifts;
        const validStops = routeItem.stops.filter(stop => {
            // 站点可见
            if (!stop.visible) return false;
            // 至少有一个启用班次停靠该站点
            if (stop.stopFor && stop.stopFor.length > 0) {
                return stop.stopFor.some(shift => enabledShifts.includes(shift));
            }
            return false;
        });
        // 按站点序号排序，确保班次始发/终点判断+序号重排准确
        return validStops.sort((a, b) => a.seq - b.seq);
    },

    // 获取指定班次的所有停靠站点（按序号排序，为序号重排提供数据）
    getShiftStopStops(routeItem, shiftKey) {
        if (!routeItem || !routeItem.stops || !shiftKey) return [];
        // 筛选该班次停靠的站点，并按序号升序排列
        const shiftStops = routeItem.stops.filter(stop => {
            return stop.visible && stop.stopFor && stop.stopFor.includes(shiftKey);
        }).sort((a, b) => a.seq - b.seq);
        return shiftStops;
    },

    // 判断指定站点是否为某班次的始发点（第一个停靠站点）
    isShiftStartStop(routeItem, stop, shiftKey) {
        const shiftStops = this.getShiftStopStops(routeItem, shiftKey);
        if (shiftStops.length === 0) return false;
        const firstShiftStop = shiftStops[0];
        return stop.seq === firstShiftStop.seq;
    },

    // 判断指定站点是否为某班次的终点（最后一个停靠站点）
    isShiftEndStop(routeItem, stop, shiftKey) {
        const shiftStops = this.getShiftStopStops(routeItem, shiftKey);
        if (shiftStops.length === 0) return false;
        const lastShiftStop = shiftStops[shiftStops.length - 1];
        return stop.seq === lastShiftStop.seq;
    },

    // 判断站点是否在某班次的停靠范围内（排除起点前/终点后站点）
    isStopInShiftRange(routeItem, stop, shiftKey) {
        const shiftStops = this.getShiftStopStops(routeItem, shiftKey);
        if (shiftStops.length === 0) return false;
        const minSeq = shiftStops[0].seq;
        const maxSeq = shiftStops[shiftStops.length - 1].seq;
        return stop.seq >= minSeq && stop.seq <= maxSeq;
    },

    // 核心：特殊班次序号重排（普通班次返回全局序号，特殊班次返回本地序号从1开始）
    getShiftLocalSeq(routeItem, stop, shiftKey) {
        // 普通班次（normal）：保留全局原始序号
        if (shiftKey === "normal") {
            return stop.seq;
        }
        // 特殊班次（非normal）：本地重排序号
        const shiftStops = this.getShiftStopStops(routeItem, shiftKey);
        if (shiftStops.length === 0) return "";
        // 查找当前站点在该班次停靠列表中的索引，索引+1即为本地序号（从1开始）
        const stopIndex = shiftStops.findIndex(item => item.seq === stop.seq);
        return stopIndex !== -1 ? (stopIndex + 1) : "";
    },

    // 分页处理：获取指定页码的站点
    getStopsByPage(validStops, pageNum) {
        if (!validStops || validStops.length === 0) return [];
        const startIdx = (pageNum - 1) * CONFIG.pageSize;
        const endIdx = startIdx + CONFIG.pageSize;
        return validStops.slice(startIdx, endIdx);
    },

    // 分栏处理：拆分左右栏站点
    splitStopsToColumns(pageStops) {
        const leftStops = pageStops.slice(0, CONFIG.singleColumnSize);
        const rightStops = pageStops.slice(CONFIG.singleColumnSize, CONFIG.pageSize);
        return { leftStops, rightStops };
    },

    // 获取总页数
    getTotalPages(validStops) {
        if (!validStops || validStops.length === 0) return 1;
        return Math.ceil(validStops.length / CONFIG.pageSize);
    },

    // 获取方向对应的目的地
    getDestByDirection(routeItem, direction) {
        if (!routeItem) return { cn: "", en: "" };
        if (direction === "A") {
            return {
                cn: routeItem.destA || "",
                en: routeItem.destAEn || ""
            };
        } else {
            return {
                cn: routeItem.destB || "",
                en: routeItem.destBEn || ""
            };
        }
    },

    // 获取当前输入前缀下，下一个可输入的有效字符
    getNextValidChars(currentInput) {
        const currentInputUpper = currentInput.toUpperCase();
        const validRouteNums = this.getValidRouteNums();
        const nextValidChars = new Set();

        // 筛选出以当前输入为前缀的线路编号
        const matchedRoutes = validRouteNums.filter(routeNum => {
            return routeNum.startsWith(currentInputUpper);
        });

        // 提取这些线路编号中，当前输入长度的下一个字符
        matchedRoutes.forEach(routeNum => {
            if (routeNum.length > currentInputUpper.length) {
                const nextChar = routeNum.charAt(currentInputUpper.length);
                nextValidChars.add(nextChar);
            }
        });

        return Array.from(nextValidChars);
    },

    // 校验线路编号是否存在
    isRouteExist(routeNum) {
        if (!routeNum) return false;
        return this.getValidRouteNums().includes(routeNum.toUpperCase());
    }
};

// ------------- 第三步：DOM渲染层（保留样式绑定 + 序号重排调用，修复站点异常显示）-------------
const Renderer = {
    // 渲染线路信息栏
    renderRouteInfo() {
        const routeItem = CONFIG.currentRouteData;
        if (!routeItem) return;

        // 渲染线路颜色和编号
        document.getElementById("routeColorBlock").style.backgroundColor = routeItem.color || "#4a90e2";
        document.getElementById("routeNumText").textContent = routeItem.route || "";

        // 渲染班次标签
        const shiftTagsWrap = document.getElementById("routeShiftTags");
        shiftTagsWrap.innerHTML = "";
        CONFIG.enabledShifts.forEach(shift => {
            const tag = document.createElement("div");
            tag.className = `shift-tag tag-${shift}`;
            tag.textContent = this.getShiftName(shift);
            shiftTagsWrap.appendChild(tag);
        });

        // 渲染目的地和方向
        const dest = DataHandler.getDestByDirection(routeItem, CONFIG.currentDirection);
        document.getElementById("destCnText").textContent = dest.cn;
        document.getElementById("destEnText").textContent = dest.en;
        document.getElementById("dirText").textContent = CONFIG.currentDirection === "A" ? "去程" : "回程";

        // 显示线路信息栏
        document.getElementById("routeInfoBar").classList.remove("hidden");
    },

    // 渲染时间表
    renderTimetable() {
        const routeItem = CONFIG.currentRouteData;
        if (!routeItem || !routeItem.timetable) return;

        // 渲染标题
        document.getElementById("timetableTitle").textContent = `${routeItem.route}路 公交线路时间表`;

        // 渲染时间表内容
        const timetableContent = document.getElementById("timetableContent");
        timetableContent.innerHTML = "";

        CONFIG.enabledShifts.forEach(shift => {
            const shiftTimetable = routeItem.timetable[shift];
            if (!shiftTimetable) return;

            const shiftWrap = document.createElement("div");
            shiftWrap.className = `timetable-shift tag-${shift}`;

            const title = document.createElement("h4");
            title.textContent = shiftTimetable.name || this.getShiftName(shift);
            shiftWrap.appendChild(title);

            const startTime = document.createElement("p");
            startTime.innerHTML = `<span>运营开始：</span>${shiftTimetable.startTime || "未知"}`;
            shiftWrap.appendChild(startTime);

            const endTime = document.createElement("p");
            endTime.innerHTML = `<span>运营结束：</span>${shiftTimetable.endTime || "未知"}`;
            shiftWrap.appendChild(endTime);

            const interval = document.createElement("p");
            interval.innerHTML = `<span>发车间隔：</span>${shiftTimetable.interval || "未知"}`;
            shiftWrap.appendChild(interval);

            timetableContent.appendChild(shiftWrap);
        });

        // 显示时间表面板
        document.getElementById("timetablePanel").classList.remove("hidden");
    },

    // 渲染站点（左右分栏）
    renderStops() {
        const routeItem = CONFIG.currentRouteData;
        if (!routeItem) return;

        // 获取有效站点
        const validStops = DataHandler.getValidStops(routeItem);
        if (validStops.length === 0) {
            this.showStopEmptyTip("当前线路暂无有效站点");
            return;
        }

        // 隐藏空提示，显示左右分栏
        this.hideStopEmptyTip();
        document.getElementById("leftStopColumn").classList.remove("hidden");
        document.getElementById("rightStopColumn").classList.remove("hidden");

        // 获取当前页站点并分栏
        const pageStops = DataHandler.getStopsByPage(validStops, CONFIG.currentPage);
        const { leftStops, rightStops } = DataHandler.splitStopsToColumns(pageStops);

        // 渲染左栏和右栏
        document.getElementById("leftStopColumn").innerHTML = this.createStopTable(leftStops);
        document.getElementById("rightStopColumn").innerHTML = this.createStopTable(rightStops);

        // 渲染分页控件
        this.renderPagination(validStops);
    },

    // 创建站点表格
    createStopTable(stopList) {
        if (!stopList || stopList.length === 0) {
            return `<div class="empty-tip" style="min-height: 400px;">暂无站点数据</div>`;
        }

        let tableHtml = `
            <table class="stop-table">
                <thead>
                    <tr>
                        <th>班次停靠状态</th>
                        <th>站点信息</th>
                    </tr>
                </thead>
                <tbody>
        `;

        stopList.forEach(stop => {
            // 判断是否为全站不停靠站点
            const isNoStop = !stop.stopFor.some(shift => CONFIG.enabledShifts.includes(shift));
            const rowClass = isNoStop ? "stop-row-visible stop-no-stop" : "stop-row-visible";

            tableHtml += `
                <tr class="${rowClass}">
                    <td>
                        <div class="multi-shift-seq-wrap">
                            ${this.createShiftSeq(stop)} <!-- 调用班次状态渲染方法 -->
                        </div>
                    </td>
                    <td>
                        <div class="stop-name-main">${stop.nameCn || ""}</div>
                        <div class="stop-name-sub">${stop.nameEn || ""}</div>
                    </td>
                </tr>
            `;
        });

        tableHtml += `
                </tbody>
            </table>
        `;

        return tableHtml;
    },

    // 核心：创建班次停靠状态（修复起点前/终点后站点异常显示）
    createShiftSeq(stop) {
        let seqHtml = "";
        const currentRouteItem = CONFIG.currentRouteData; // 当前线路数据

        CONFIG.enabledShifts.forEach(shift => {
            // 1. 严格判断：站点是否在该班次停靠范围内（排除起点前/终点后）
            const isInShiftRange = DataHandler.isStopInShiftRange(currentRouteItem, stop, shift);
            // 2. 严格判断：站点是否停靠该班次
            const isStop = !!stop.stopFor && stop.stopFor.includes(shift);
            // 3. 判断：是否为该班次始发点
            const isShiftStartStop = DataHandler.isShiftStartStop(currentRouteItem, stop, shift);
            // 4. 判断：是否为该班次终点
            const isShiftEndStop = DataHandler.isShiftEndStop(currentRouteItem, stop, shift);
            
            // 非停靠范围内的站点，直接跳过渲染
            if (!isInShiftRange) {
                return;
            }

            // 5. 动态拼接类名（区分停靠/不停靠 + 始发/终点）
            let seqWrapClassBase = isStop 
                ? "single-shift-seq-wrap seq-wrap-middle-stop" 
                : "single-shift-seq-wrap seq-wrap-middle-no-stop"; // 不停靠班次绑定专属类名
            
            // 始发点/终点添加通用样式类（实心白字）
            if (isShiftStartStop || isShiftEndStop) {
                seqWrapClassBase = `${seqWrapClassBase} shift-start-end-stop`;
            }
            // 始发点添加专属类（隐藏上侧线条）
            if (isShiftStartStop) {
                seqWrapClassBase = `${seqWrapClassBase} shift-start-stop`;
            }
            // 终点添加专属类（隐藏下侧线条）
            if (isShiftEndStop) {
                seqWrapClassBase = `${seqWrapClassBase} shift-end-stop`;
            }
            const seqWrapClass = `${seqWrapClassBase} line-${shift}`;
            
            // 6. 调用序号重排方法：普通班次全局序号，特殊班次本地序号（从1开始）
            const seqText = isStop ? DataHandler.getShiftLocalSeq(currentRouteItem, stop, shift) : "";
            // 7. 新增：为不停靠班次的文本容器添加专属类（用于样式控制）
            const seqTextClass = isStop ? "shift-seq-text" : "shift-seq-text no-stop-x"; // 不停靠时添加no-stop-x类
            
            // 8. 拼接HTML，渲染班次状态（线条/背景样式由CSS控制）
            seqHtml += `
                <div class="${seqWrapClass}">
                    <div class="shift-seq-line"></div> <!-- 上侧线条：停靠实线/不停靠虚线 -->
                    <div class="${seqTextClass}">${seqText}</div> <!-- 序号：停靠显示序号/不停靠隐藏 -->
                    <div class="shift-seq-line"></div> <!-- 下侧线条：停靠实线/不停靠虚线 -->
                </div>
            `;
        });
        return seqHtml;
    },

    // 获取班次中文名称
    getShiftName(shiftKey) {
        switch (shiftKey) {
            case "normal":
                return "普通班次";
            case "special":
                return "夜间班次";
            case "special1":
                return "高峰班次";
            case "special2":
                return "平峰班次";
            case "special3":
                return "旅游班次";
            default:
                return shiftKey;
        }
    },

    // 渲染分页控件
    renderPagination(validStops) {
        const totalPages = DataHandler.getTotalPages(validStops);
        // 更新分页文本
        document.getElementById("currentPageText").textContent = CONFIG.currentPage;
        document.getElementById("totalPageText").textContent = totalPages;

        // 禁用/启用分页按钮
        document.getElementById("firstPageBtn").disabled = CONFIG.currentPage === 1;
        document.getElementById("prevPageBtn").disabled = CONFIG.currentPage === 1;
        document.getElementById("nextPageBtn").disabled = CONFIG.currentPage === totalPages;
        document.getElementById("lastPageBtn").disabled = CONFIG.currentPage === totalPages;

        // 显示分页控件
        document.getElementById("paginationControl").classList.remove("hidden");
    },

    // 显示站点空提示
    showStopEmptyTip(text) {
        const emptyTip = document.getElementById("stopEmptyTip");
        emptyTip.textContent = text || "暂无站点数据";
        emptyTip.classList.remove("hidden");

        // 隐藏分栏和分页
        document.getElementById("leftStopColumn").classList.add("hidden");
        document.getElementById("rightStopColumn").classList.add("hidden");
        document.getElementById("paginationControl").classList.add("hidden");
    },

    // 隐藏站点空提示
    hideStopEmptyTip() {
        document.getElementById("stopEmptyTip").classList.add("hidden");
    },

    // 隐藏时间表面板
    hideTimetable() {
        document.getElementById("timetablePanel").classList.add("hidden");
    },

    // 隐藏线路信息栏
    hideRouteInfo() {
        document.getElementById("routeInfoBar").classList.add("hidden");
    },

    // 更新键盘按键状态
    updateKeyboardBtnStatus() {
        const currentInput = CONFIG.currentRouteNum || "";
        const nextValidChars = DataHandler.getNextValidChars(currentInput);
        const allKeyboardBtns = document.querySelectorAll(".main-num-key, .sub-letter-btn");

        // 遍历所有按键，动态设置禁用/启用状态
        allKeyboardBtns.forEach(btn => {
            const btnValue = btn.getAttribute("data-key").toUpperCase();
            if (nextValidChars.includes(btnValue)) {
                btn.disabled = false;
            } else {
                btn.disabled = true;
            }
        });

        // 特殊处理：删除键和清空键始终可用
        document.getElementById("keyboardDeleteBtn").disabled = false;
        document.getElementById("keyboardClearBtn").disabled = false;
        // 确认键：仅当线路编号存在时启用
        const confirmBtn = document.getElementById("keyboardConfirmBtn");
        confirmBtn.disabled = !DataHandler.isRouteExist(currentInput);
    }
};

// ------------- 第四步：事件绑定层（修复键盘拖拽失效）-------------
const EventBinder = {
    // 初始化所有事件
    initAllEvents() {
        this.bindRouteSelectBtnEvent();
        this.bindRouteInputEvent();
        this.bindDirectionBtnEvent();
        this.bindTimetableBtnEvent();
        this.bindPaginationEvents();
        this.bindKeyboardEvents();
        this.bindKeyboardDragEvent();
    },

    // 绑定线路选择按钮事件
    bindRouteSelectBtnEvent() {
        const openBtn = document.getElementById("openRouteSelectBtn");
        const selectPanel = document.getElementById("routeSelectPanel");
        openBtn.addEventListener("click", () => {
            selectPanel.classList.toggle("hidden");
            // 重置输入框
            document.getElementById("routeNumberInput").value = "";
            CONFIG.currentRouteNum = "";
            // 重置方向按钮激活状态
            this.resetDirectionBtnActive();
            // 隐藏线路信息和站点
            Renderer.hideRouteInfo();
            Renderer.showStopEmptyTip("请先选择公交线路查看站点信息");
            // 重置键盘按键状态
            Renderer.updateKeyboardBtnStatus();
        });
    },

    // 绑定线路输入框事件
    bindRouteInputEvent() {
        const input = document.getElementById("routeNumberInput");
        const keyboard = document.getElementById("customKeyboard");

        // 聚焦输入框显示键盘 + 初始化按键状态
        input.addEventListener("focus", () => {
            keyboard.classList.remove("hidden");
            // 默认定位在输入框下方
            const inputRect = input.getBoundingClientRect();
            keyboard.style.left = `${inputRect.left}px`;
            keyboard.style.top = `${inputRect.bottom + 10}px`;
            // 更新按键状态
            Renderer.updateKeyboardBtnStatus();
        });

        // 输入变化时更新全局路由编号 + 按键状态
        input.addEventListener("input", () => {
            const inputValue = input.value.trim().toUpperCase();
            CONFIG.currentRouteNum = inputValue;
            Renderer.updateKeyboardBtnStatus();
        });
    },

    // 绑定方向按钮事件
    bindDirectionBtnEvent() {
        const directionBtns = document.querySelectorAll(".direction-btn");
        directionBtns.forEach(btn => {
            btn.addEventListener("click", () => {
                const routeNum = CONFIG.currentRouteNum;
                if (!routeNum) {
                    alert("请先输入线路编号！");
                    return;
                }
                if (!DataHandler.isRouteExist(routeNum)) {
                    alert("输入的线路编号不存在，请重新输入！");
                    return;
                }

                // 移除所有激活状态
                directionBtns.forEach(b => b.classList.remove("active"));
                // 添加当前按钮激活状态
                btn.classList.add("active");
                // 更新全局方向
                CONFIG.currentDirection = btn.getAttribute("data-dir");
                // 加载线路数据
                this.loadRouteData(routeNum);
            });
        });
    },

    // 绑定时间表按钮事件
    bindTimetableBtnEvent() {
        const showBtn = document.getElementById("timetableBtn");
        const closeBtn = document.getElementById("closeTimetableBtn");

        // 显示时间表
        showBtn.addEventListener("click", () => {
            if (!CONFIG.currentRouteData) {
                alert("请先选择有效线路！");
                return;
            }
            Renderer.renderTimetable();
        });

        // 隐藏时间表
        closeBtn.addEventListener("click", () => {
            Renderer.hideTimetable();
        });
    },

    // 绑定分页控件事件
    bindPaginationEvents() {
        const firstPageBtn = document.getElementById("firstPageBtn");
        const prevPageBtn = document.getElementById("prevPageBtn");
        const nextPageBtn = document.getElementById("nextPageBtn");
        const lastPageBtn = document.getElementById("lastPageBtn");

        // 首页
        firstPageBtn.addEventListener("click", () => {
            if (CONFIG.currentPage === 1) return;
            CONFIG.currentPage = 1;
            Renderer.renderStops();
        });

        // 上一页
        prevPageBtn.addEventListener("click", () => {
            if (CONFIG.currentPage <= 1)                 return;
            CONFIG.currentPage -= 1;
            Renderer.renderStops();
        });

        // 下一页
        nextPageBtn.addEventListener("click", () => {
            const validStops = DataHandler.getValidStops(CONFIG.currentRouteData);
            const totalPages = DataHandler.getTotalPages(validStops);
            if (CONFIG.currentPage >= totalPages) return;
            CONFIG.currentPage += 1;
            Renderer.renderStops();
        });

        // 末页
        lastPageBtn.addEventListener("click", () => {
            const validStops = DataHandler.getValidStops(CONFIG.currentRouteData);
            const totalPages = DataHandler.getTotalPages(validStops);
            if (CONFIG.currentPage === totalPages) return;
            CONFIG.currentPage = totalPages;
            Renderer.renderStops();
        });
    },

    // 绑定虚拟键盘按键事件
    bindKeyboardEvents() {
        const input = document.getElementById("routeNumberInput");
        const keyboardBtns = document.querySelectorAll(".main-num-key, .sub-letter-btn");
        const deleteBtn = document.getElementById("keyboardDeleteBtn");
        const clearBtn = document.getElementById("keyboardClearBtn");
        const confirmBtn = document.getElementById("keyboardConfirmBtn");

        // 数字/字母按键事件
        keyboardBtns.forEach(btn => {
            btn.addEventListener("click", () => {
                if (btn.disabled) return;
                const keyValue = btn.getAttribute("data-key");
                input.value = (input.value || "") + keyValue;
                // 同步更新全局路由编号并刷新按键状态
                const inputValue = input.value.trim().toUpperCase();
                CONFIG.currentRouteNum = inputValue;
                Renderer.updateKeyboardBtnStatus();
                // 保持输入框聚焦
                input.focus();
            });
        });

        // 删除键事件
        deleteBtn.addEventListener("click", () => {
            const currentValue = input.value || "";
            input.value = currentValue.slice(0, currentValue.length - 1);
            // 同步更新全局路由编号并刷新按键状态
            const inputValue = input.value.trim().toUpperCase();
            CONFIG.currentRouteNum = inputValue;
            Renderer.updateKeyboardBtnStatus();
            // 保持输入框聚焦
            input.focus();
        });

        // 清空键事件
        clearBtn.addEventListener("click", () => {
            input.value = "";
            // 同步更新全局路由编号并刷新按键状态
            CONFIG.currentRouteNum = "";
            Renderer.updateKeyboardBtnStatus();
            // 重置方向按钮激活状态
            this.resetDirectionBtnActive();
            // 隐藏线路信息和站点
            Renderer.hideRouteInfo();
            Renderer.showStopEmptyTip("请先选择公交线路查看站点信息");
            // 保持输入框聚焦
            input.focus();
        });

        // 确认键事件
        confirmBtn.addEventListener("click", () => {
            const routeNum = CONFIG.currentRouteNum;
            if (!routeNum || !DataHandler.isRouteExist(routeNum)) {
                alert("请输入有效的线路编号！");
                return;
            }
            // 自动激活A方向按钮（默认）
            const directionABtn = document.querySelector('.direction-btn[data-dir="A"]');
            if (directionABtn) {
                directionABtn.click();
            }
            // 隐藏线路选择面板
            document.getElementById("routeSelectPanel").classList.add("hidden");
        });
    },

    // 修复：键盘拖拽功能（核心：修正选择器 + 完善拖拽逻辑）
    bindKeyboardDragEvent() {
        const keyboard = document.getElementById("customKeyboard");
        const dragHandle = document.getElementById("keyboardDragHandle"); // 修正选择器，对应HTML的id
        let isDragging = false;
        let offsetX = 0;
        let offsetY = 0;

        // 鼠标按下：开始拖拽
        dragHandle.addEventListener("mousedown", (e) => {
            isDragging = true;
            // 获取鼠标相对于键盘的偏移量（避免拖拽时跳动）
            const keyboardRect = keyboard.getBoundingClientRect();
            offsetX = e.clientX - keyboardRect.left;
            offsetY = e.clientY - keyboardRect.top;
            // 添加拖拽样式
            dragHandle.style.cursor = "grabbing";
            keyboard.style.userSelect = "none"; // 拖拽时禁止文本选择
            keyboard.style.zIndex = "1001"; // 拖拽时置顶
        });

        // 鼠标移动：执行拖拽
        document.addEventListener("mousemove", (e) => {
            if (!isDragging) return;
            // 计算键盘新位置（基于鼠标位置 - 偏移量）
            const newLeft = e.clientX - offsetX;
            const newTop = e.clientY - offsetY;
            // 设置键盘位置（限制在可视区域内，避免超出屏幕）
            keyboard.style.left = `${Math.max(0, Math.min(newLeft, window.innerWidth - keyboard.offsetWidth))}px`;
            keyboard.style.top = `${Math.max(0, Math.min(newTop, window.innerHeight - keyboard.offsetHeight))}px`;
        });

        // 鼠标松开：结束拖拽
        document.addEventListener("mouseup", () => {
            if (!isDragging) return;
            isDragging = false;
            // 恢复样式
            dragHandle.style.cursor = "move";
            keyboard.style.userSelect = "auto";
            keyboard.style.zIndex = "1000";
        });

        // 鼠标离开文档：强制结束拖拽（兼容边界情况）
        document.addEventListener("mouseleave", () => {
            if (isDragging) {
                isDragging = false;
                dragHandle.style.cursor = "move";
                keyboard.style.userSelect = "auto";
                keyboard.style.zIndex = "1000";
            }
        });
    },

    // 重置方向按钮激活状态
    resetDirectionBtnActive() {
        const directionBtns = document.querySelectorAll(".direction-btn");
        directionBtns.forEach(btn => {
            btn.classList.remove("active");
        });
    },

    // 加载线路数据并渲染
    loadRouteData(routeNum) {
        const routeItem = DataHandler.getRouteByNum(routeNum);
        if (!routeItem) {
            alert("线路数据加载失败，请重试！");
            return;
        }
        // 更新全局线路数据和启用班次
        CONFIG.currentRouteData = routeItem;
        CONFIG.enabledShifts = DataHandler.getEnabledShifts(routeItem);
        // 重置当前页码
        CONFIG.currentPage = 1;
        // 渲染线路信息和站点
        Renderer.renderRouteInfo();
        Renderer.renderStops();
    }
};

// ------------- 第五步：初始化（页面加载完成后执行）-------------
document.addEventListener("DOMContentLoaded", () => {
    // 初始化所有事件
    EventBinder.initAllEvents();
    // 初始显示站点空提示
    Renderer.showStopEmptyTip("请先选择公交线路查看站点信息");
});

// 更新日志数据，仅维护在该文件中
var updateLogData = {
    title: "Update Logs",
    version: "v2.0.0",
    updateTime: "2026-01-07",
    logs: [
        {
            id: 1,
            version: "v2.0.0",
            time: "2026-01-07",
            title: "UI improvement (Phrase 1)",
            content: [
                "✅ UI improvement",
                "✅ Added route labels and colors",
                "✅ Added sub-name",
                "And other minor bug fixes and improvements "
            ]
        },
        {
            id: 2,
            version: "v1.5.0",
            time: "2026-01-06",
            title: "More functions",
            content: [
                "✅ Added Timetable",
                "✅ Added Direction button",
                "And other minor bug fixes and improvements "
            ]
        },
        {
            id: 3,
            version: "v0.0.1",
            time: "2026-01-05",
            title: "Website created",
            content: [
                "✅ "
            ]
        }
    ]
};

// 获取更新日志数据方法
function getUpdateLogData() {
    return updateLogData;
}

//"修复偶现的\"暂无站点数据\"问题",
//"优化不停站样式，外框改为灰色",
//"调整副站名显示位置至正站名旁",
//"修复起点/终点线条显示问题",
//"新增临时暂停站点标签及原因显示",
//"优化环线显示逻辑",
//"提升移动端适配效果"
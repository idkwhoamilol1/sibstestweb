// 纯数据仓库 - 公交线路基础数据
const routeData = {
    data: [
        {
            route: "T",
            enabled: true,
            color: "#4a90e2",
            destA: "火车站",
            destAEn: "Railway Station",
            destB: "汽车站",
            destBEn: "Bus Station",
            shifts: {
                normal: true,
                special: true,
                special1: true,
                special2: true,
                special3: true
            },
            timetable: {
                normal: {
                    name: "普通班次",
                    startTime: "06:00",
                    endTime: "22:00",
                    interval: "10分钟/班"
                },
                special1: {
                    name: "高峰班次",
                    startTime: "07:00",
                    endTime: "09:00",
                    interval: "5分钟/班"
                },
                special2: {
                    name: "平峰班次",
                    startTime: "09:00",
                    endTime: "17:00",
                    interval: "15分钟/班"
                }
            },
            stops: [
                {
                    seq: 1,
                    nameCn: "火车站广场",
                    nameEn: "Railway Station Square",
                    visible: false,
                    stopFor: ["normal", "special", "special1", "special2", "special3"]
                },
                {
                    seq: 2,
                    nameCn: "市中心医院",
                    nameEn: "Central Hospital",
                    visible: true,
                    stopFor: ["normal", "special1", "special2"]
                },
                {
                    seq: 3,
                    nameCn: "人民广场",
                    nameEn: "People's Square",
                    visible: true,
                    stopFor: ["normal", "special", "special1"]
                },
                {
                    seq: 4,
                    nameCn: "政务中心",
                    nameEn: "Government Affairs Center",
                    visible: true,
                    stopFor: ["normal", "special2"]
                },
                {
                    seq: 5,
                    nameCn: "体育中心",
                    nameEn: "Sports Center",
                    visible: true,
                    stopFor: ["normal", "special", "special1", "special2"]
                },
                {
                    seq: 6,
                    nameCn: "会展中心",
                    nameEn: "Exhibition Center",
                    visible: true,
                    stopFor: ["normal"]
                },
                {
                    seq: 7,
                    nameCn: "大学城",
                    nameEn: "University Town",
                    visible: true,
                    stopFor: ["normal", "special", "special1", "special2"]
                },
                {
                    seq: 8,
                    nameCn: "高新区",
                    nameEn: "High Tech Zone",
                    visible: true,
                    stopFor: ["normal", "special2"]
                },
                {
                    seq: 9,
                    nameCn: "汽车西站",
                    nameEn: "West Bus Station",
                    visible: true,
                    stopFor: ["normal", "special1"]
                },
                {
                    seq: 10,
                    nameCn: "汽车站总站",
                    nameEn: "Bus Station Terminal",
                    visible: true,
                    stopFor: ["normal", "special1", "special2", "special3"]
                },
                {
                    seq: 11,
                    nameCn: "建材市场",
                    nameEn: "Building Materials Market",
                    visible: true,
                    stopFor: ["normal", "special", "special3"]
                },
                {
                    seq: 12,
                    nameCn: "物流园",
                    nameEn: "Logistics Park",
                    visible: true,
                    stopFor: ["normal", "special2"]
                },
                {
                    seq: 13,
                    nameCn: "五金城",
                    nameEn: "Hardware City",
                    visible: true,
                    stopFor: ["normal"]
                },
                {
                    seq: 14,
                    nameCn: "农机市场",
                    nameEn: "Agricultural Machinery Market",
                    visible: true,
                    stopFor: ["special1"]
                },
                {
                    seq: 15,
                    nameCn: "湿地公园",
                    nameEn: "Wetland Park",
                    visible: true,
                    stopFor: ["normal", "special1", "special2"]
                },
                {
                    seq: 16,
                    nameCn: "植物园",
                    nameEn: "Botanical Garden",
                    visible: true,
                    stopFor: ["normal"]
                },
                {
                    seq: 17,
                    nameCn: "动物园",
                    nameEn: "Zoo",
                    visible: true,
                    stopFor: ["normal", "special2"]
                },
                {
                    seq: 18,
                    nameCn: "游乐场",
                    nameEn: "Amusement Park",
                    visible: true,
                    stopFor: ["normal", "special1"]
                },
                {
                    seq: 19,
                    nameCn: "度假村",
                    nameEn: "Resort",
                    visible: true,
                    stopFor: ["normal"]
                },
                {
                    seq: 20,
                    nameCn: "温泉酒店",
                    nameEn: "Hot Spring Hotel",
                    visible: true,
                    stopFor: ["normal", "special1", "special2"]
                },
                {
                    seq: 21,
                    nameCn: "生态农庄",
                    nameEn: "Ecological Farm",
                    visible: true,
                    stopFor: ["normal"]
                },
                {
                    seq: 22,
                    nameCn: "采摘园",
                    nameEn: "Picking Garden",
                    visible: true,
                    stopFor: ["special2", "special3"]
                }
            ]
        },
        {
            route: "101",
            enabled: true,
            color: "#28a745",
            destA: "高铁站",
            destAEn: "High Speed Railway Station",
            destB: "码头",
            destBEn: "Wharf",
            shifts: {
                normal: true,
                special: true,
                special1: true,
                special2: false,
                special3: false
            },
            timetable: {
                normal: {
                    name: "普通班次",
                    startTime: "05:30",
                    endTime: "23:00",
                    interval: "12分钟/班"
                },
                special: {
                    name: "夜间班次",
                    startTime: "22:00",
                    endTime: "00:00",
                    interval: "30分钟/班"
                },
                special3: {
                    name: "旅游班次",
                    startTime: "08:00",
                    endTime: "18:00",
                    interval: "20分钟/班"
                }
            },
            stops: [
                {
                    seq: 1,
                    nameCn: "高铁站东广场",
                    nameEn: "High Speed Railway Station East Square",
                    visible: true,
                    stopFor: ["normal"]
                },
                {
                    seq: 2,
                    nameCn: "客运中心",
                    nameEn: "Passenger Transport Center",
                    visible: true,
                    stopFor: ["normal", "special", "special1"]
                },
                {
                    seq: 3,
                    nameCn: "购物中心",
                    nameEn: "Shopping Mall",
                    visible: true,
                    stopFor: ["normal", "special1"]
                },
                {
                    seq: 4,
                    nameCn: "公园南门",
                    nameEn: "Park South Gate",
                    visible: true,
                    stopFor: ["normal", "special"]
                },
                {
                    seq: 5,
                    nameCn: "博物馆",
                    nameEn: "Museum",
                    visible: true,
                    stopFor: ["normal", "special3"]
                }
            ]
        }
    ]
};
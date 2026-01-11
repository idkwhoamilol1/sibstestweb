var updateLogData = {
    title: "Update Logs",
    version: "v0.2.2",
    updateTime: "2026-01-11",
    logs: [
        {
            id: 1,
            version: "v0.2.2",
            time: "2026-01-11",
            title: "Big Improvements",
            content: {
                added: [
                    "Added New multi-language support for all UI elements"
                ],
                fixed: [
                    "Fixed Stop-list issues",
                    "Fixed Version number display issue"
                ],
                removed: [
                    "Removed Confirm button from input screen",
                    "Removed Previous Route Number Input after clicking the Back button"
                ],
                revamped: [
                    "Revamped Route Description panel",
                    "Revamped Timetable with UI (all direction)",
                    "Revamped Update Log UI"
                ],
                improvements: [
                    "Other minor bug fixes and improvements"
                ]
            }
        },
        {
            id: 2,
            version: "v0.2.1",
            time: "2026-01-07",
            title: "Website published",
            content: {
                improvements: [
                    "UI improvements",
                    "Other minor bug fixes and improvements"
                ]
            }
        },
        {
            id: 3,
            version: "v0.1.2",
            time: "2026-01-07",
            title: "Improvements",
            content: {
                added: [
                    "Added Route labels and colors",
                    "Added Subname in certain stations (in progress)"
                ],
                improvements: [
                    "Other minor bug fixes and improvements"
                ]
            }
        },
        {
            id: 4,
            version: "v0.1.1",
            time: "2026-01-06",
            title: "Improvements",
            content: {
                added: [
                    "Added Direction button that can change the opposite direction",
                    "Added Timetable (single direction only)"
                ],
                improvements: [
                    "Other minor bug fixes and improvements"
                ]
            }
        },
        {
            id: 5,
            version: "v0.0.1",
            time: "2026-01-05",
            title: "Website created",
            content: {
                added: [
                    "Initial website structure",
                    "Basic route query functionality"
                ],
                improvements: [
                    "Test content implementation"
                ]
            }
        }
    ]
};

function getUpdateLogData() {
    return updateLogData;
}

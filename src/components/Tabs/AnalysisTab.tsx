import * as am5 from "@amcharts/amcharts5";
import * as am5percent from "@amcharts/amcharts5/percent";
import am5themes_Kelly from "@amcharts/amcharts5/themes/Kelly";
import React, { useLayoutEffect, useRef } from 'react';
import { reportStore } from '../../services/udemy/report_store';

const AnalysisTab: React.FC = () => {
    const numberOfSuccess = reportStore.getReport().statistics.enrollNowCount;
    const numberOfFailed = reportStore.getReport().statistics.buyNowCount;
    const numberOfEnrolled = reportStore.getReport().statistics.goToCourseCount;
    const hasData = numberOfSuccess > 0 || numberOfFailed > 0 || numberOfEnrolled > 0;

    const chartRef = useRef<am5.Root | null>(null);

    useLayoutEffect(() => {
        // Dispose chart when component unmounts
        return () => {
            if (chartRef.current) {
                chartRef.current.dispose();
            }
        };
    }, []);

    useLayoutEffect(() => {
        // Chỉ tạo biểu đồ nếu có dữ liệu
        if (!hasData) return;

        // Create root element
        const root = am5.Root.new("chartdiv");
        chartRef.current = root;

        const myTheme = am5themes_Kelly.new(root)
        myTheme.rule("Label").setAll({
            fontFamily: "Craft Rounded",
            fontSize: 14,
            fontWeight: "500"
        })
        // Set themes
        root.setThemes([myTheme]);

        // Create container layout
        root.container.set("layout", root.verticalLayout);

        // Create chart - Enrollment statistics
        const chart = root.container.children.push(
            am5percent.PieChart.new(root, {
                endAngle: 270,
                innerRadius: am5.percent(60),
                tooltip: am5.Tooltip.new(root, {}),
                width: am5.percent(90),
                height: am5.percent(80),
                layout: root.horizontalLayout,
                centerX: am5.percent(50),
                x: am5.percent(50)
            })
        );

        // Create series
        const series: any = chart.series.push(
            am5percent.PieSeries.new(root, {
                valueField: "value",
                categoryField: "category",
                endAngle: 270,
                alignLabels: false
            })
        );

        series.children.push(am5.Label.new(root, {
            centerX: am5.percent(50),
            centerY: am5.percent(50),
            text: "Total\n{valueSum} courses",
            populateText: true,
            fontSize: "1.5em",
            fontFamily: "Craft Rounded Demi"
        }));

        series.slices.template.setAll({
            cornerRadius: 12,
            strokeWidth: 2
        });

        series.states.create("hidden", {
            endAngle: -90
        });

        series.labels.template.setAll({
            textType: "circular"
        });

        // Set data for the chart - Enrollments
        // Lọc bỏ các categories có value = 0 để tránh text bị chồng lên nhau
        const chartData = [
            {
                category: "Success",
                value: numberOfSuccess
            },
            {
                category: "Expired",
                value: numberOfFailed
            },
            {
                category: "Enrolled",
                value: numberOfEnrolled
            }
        ].filter(item => item.value > 0);

        // Chỉ hiển thị dữ liệu có giá trị > 0
        series.data.setAll(chartData);

        // Create legend
        const legend = root.container.children.push(
            am5.Legend.new(root, {
                centerX: am5.percent(50),
                x: am5.percent(50),
                layout: root.verticalLayout
            })
        );

        // Link legend to series
        legend.data.setAll(series.dataItems);

        // Add legend interaction
        legend.itemContainers.template.events.on("pointerover", function (ev: any) {
            const dataItem = ev.target.dataItem.dataContext;
            const slice = series.getDataItemByCategory(dataItem.get("category"))?.get("slice");
            if (slice) {
                slice.hover();
            }
        });

        legend.itemContainers.template.events.on("pointerout", function (ev: any) {
            const dataItem = ev.target.dataItem.dataContext;
            const slice = series.getDataItemByCategory(dataItem.get("category"))?.get("slice");
            if (slice) {
                slice.unhover();
            }
        });

        legend.itemContainers.template.on("active", function (active, target: any) {
            const dataItem = target.dataItem.dataContext;
            const slice = series.getDataItemByCategory(dataItem.get("category"))?.get("slice");

            if (slice) {
                if (active) {
                    series.hideDataItem(slice.dataItem as any);
                } else {
                    series.showDataItem(slice.dataItem as any);
                }
            }
        });

        // Make the chart animate on load
        series.appear(1000, 100);

    }, [numberOfEnrolled, numberOfFailed, numberOfSuccess, hasData]);

    return (
        <div className="h-full p-4 overflow-y-auto bg-base">
            <h2 className="text-xl font-bold mb-2">Analysis</h2>

            {hasData ? (
                /* Chart container */
                <div id="chartdiv" className="w-full h-[400px] bg-base"></div>
            ) : (
                /* No data message */
                <div className="w-full h-[400px] bg-base flex items-center justify-center">
                    <div className="text-center">
                        <p className="text-gray-500 text-lg font-craft-demi">No data available</p>
                        <p className="text-gray-400 mt-2 font-craft-demi">There are currently no courses with statistics to dissplay</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AnalysisTab; 
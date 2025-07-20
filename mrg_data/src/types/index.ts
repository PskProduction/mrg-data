export interface MRGData {
    name: string,
    connectionPoint: string,
    mg: number,
    km: number | null,
    period: string,
    loadLevel: number,
    actualFlow: number,
    technicalFlow: number,
}

export interface IModalChartData {
    isOpen: boolean,
    chartData: MRGData[],
}
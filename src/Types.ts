
export interface DataHeaderData
{
	dayOfWeek: string;
	dayOfMonth: number;
	dayOfMonthIsShort: boolean;
	month: string;
}

export interface DataHeader
{
	title: string;
	date: DataHeaderData;
}

export interface DataWeek
{
	from: string;
	to: string;
}

export interface DataWeeks
{
	first: DataWeek;
	second: DataWeek;
	third: DataWeek;
}

export interface DataWeeklyTrend
{
	value: number;
	up: boolean;
	graph: string;
}

export interface DataWeeklyTrends
{
	week1: DataWeeklyTrend;
	week2: DataWeeklyTrend;
	week3: DataWeeklyTrend;
}

export interface DataBeds
{
	available: number;
	usedPercentage: number;
	lastUpdate: string;
}

export interface DataVaccinationDose
{
	percent: number;
	quantity: string;
	size: number;
}

export interface DataVaccination
{
	first: DataVaccinationDose;
	second: DataVaccinationDose;
}

export interface DataTree
{
	header: DataHeader;
	weeks: DataWeeks;
	newCases: DataWeeklyTrends;
	deaths: DataWeeklyTrends;
	positivity: DataWeeklyTrends;
	beds: DataBeds;
	vaccination: DataVaccination
}

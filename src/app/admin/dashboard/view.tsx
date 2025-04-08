"use client";

import { useEffect, useState } from "react";
import useSWR from "swr";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const Dashboard = () => {
  const { data: totalUsersData } = useSWR(
    "/api/analytics/total-users",
    fetcher
  );
  const { data: devicesData } = useSWR("/api/analytics/top-devices", fetcher);
  const { data: countriesData } = useSWR(
    "/api/analytics/top-countries",
    fetcher
  );
  const { data: topPagesData } = useSWR("/api/analytics/top-pages", fetcher);
  const { data: trafficData } = useSWR(
    "/api/analytics/traffic-over-time?period=monthly",
    fetcher
  );

  console.log(
    totalUsersData,
    devicesData,
    countriesData,
    topPagesData,
    trafficData
  );

  const [totalUsers, setTotalUsers] = useState("0");
  const [devices, setDevices] = useState([]);
  const [countries, setCountries] = useState([]);
  const [topPages, setTopPages] = useState([]);
  const [traffic, setTraffic] = useState([]);

  useEffect(() => {
    if (totalUsersData) setTotalUsers(totalUsersData.totalUsers);
    if (devicesData) setDevices(devicesData.devices);
    if (countriesData) setCountries(countriesData.countries);
    if (topPagesData) setTopPages(topPagesData.pages);
    if (trafficData) setTraffic(trafficData.traffic);
  }, [totalUsersData, devicesData, countriesData, topPagesData, trafficData]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Total Users (Last 30 Days)</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl">{totalUsers}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Top Devices</CardTitle>
        </CardHeader>
        <CardContent>
          <ul>
            {devices.map((device, index) => (
              <li key={index}>
                {device.device}: {device.users}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Top Countries</CardTitle>
        </CardHeader>
        <CardContent>
          <ul>
            {countries.map((country, index) => (
              <li key={index}>
                {country.country}: {country.users}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Top Pages</CardTitle>
        </CardHeader>
        <CardContent>
          <ul>
            {topPages.map((page, index) => (
              <li key={index}>
                {page.path}: {page.views}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card className="col-span-1 md:col-span-2">
        <CardHeader>
          <CardTitle>Monthly Traffic (Last 12 Months)</CardTitle>
        </CardHeader>
        <CardContent>
          <ul>
            {traffic.map((entry, index) => (
              <li key={index}>
                {entry.period}: {entry.users}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;

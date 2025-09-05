"use client";

import React, { useMemo, useState } from "react";
import Navbar from "@/app/components/NavBarBeforeSignIn";
import AdminSideBar from "@/app/components/adminDashboard/AdminSideBar";
import SearchBar from "@/app/components/ui/SearchBar";
import Section from "@/app/components/adminDashboard/Section";
import PlaceholderCard from "@/app/components/adminDashboard/PlaceholderCard";
import RequestRow from "@/app/components/adminDashboard/RequestRow";
import requestsData from "@/app/data/requestsForAdminPage.json" assert { type: "json" };

export default function AdminRequestPage() {
  const [query, setQuery] = useState("");
  const [normal, setNormal] = useState(requestsData.normal || []);
  const [employer, setEmployer] = useState(requestsData.employer || []);

  const filteredNormal = useMemo(
    () =>
      normal.filter((u) => u.name.toLowerCase().includes(query.toLowerCase())),
    [normal, query]
  );
  const filteredEmployer = useMemo(
    () =>
      employer.filter((u) =>
        u.name.toLowerCase().includes(query.toLowerCase())
      ),
    [employer, query]
  );

  const acceptFrom = (list, setter, id) =>
    setter(list.filter((u) => u.id !== id)); // demo: remove on accept
  const refuseFrom = (list, setter, id) =>
    setter(list.filter((u) => u.id !== id)); // demo: remove on refuse

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="mx-auto w-full max-w-6xl px-6 py-8">
        <h1 className="mb-6 text-2xl font-bold text-[#DD5B45]">
          Admin DashBoard
        </h1>

        <div className="flex gap-6">
          <AdminSideBar />

          <div className="flex-1">
            {/* Centered title with search on a new row */}
            <div className="mb-4 rounded-xl bg-white p-6 text-center shadow">
              <div className="mb-4 text-3xl font-semibold text-[#E55B3C]">
                Request Management
              </div>
              <div className="flex justify-center">
                <SearchBar
                  value={query}
                  onChange={setQuery}
                  onSearch={() => {}}
                />
              </div>
            </div>

            {/* Normal User requests */}
            <Section title="Normal User">
              {filteredNormal.length === 0 ? (
                <PlaceholderCard
                  title="No requests"
                  description="Nothing to review here."
                />
              ) : (
                <div className="h-80 overflow-y-auto pr-2">
                  {filteredNormal.map((r) => (
                    <RequestRow
                      key={r.id}
                      name={r.name}
                      subtitle={r.subtitle}
                      onDetails={() => console.log("details", r.id)}
                      onAccept={() => acceptFrom(normal, setNormal, r.id)}
                      onRefuse={() => refuseFrom(normal, setNormal, r.id)}
                    />
                  ))}
                </div>
              )}
            </Section>

            {/* Employer requests */}
            <Section title="Employer">
              {filteredEmployer.length === 0 ? (
                <PlaceholderCard
                  title="No employer requests"
                  description="All caught up!"
                />
              ) : (
                <div className="h-80 overflow-y-auto pr-2">
                  {filteredEmployer.map((r) => (
                    <RequestRow
                      key={r.id}
                      name={r.name}
                      subtitle={r.subtitle}
                      onDetails={() => console.log("details", r.id)}
                      onAccept={() => acceptFrom(employer, setEmployer, r.id)}
                      onRefuse={() => refuseFrom(employer, setEmployer, r.id)}
                    />
                  ))}
                </div>
              )}
            </Section>
          </div>
        </div>
      </main>
    </div>
  );
}

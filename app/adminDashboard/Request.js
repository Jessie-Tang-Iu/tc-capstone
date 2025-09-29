"use client";

import { useMemo, useState } from "react";

import SearchBar from "@/app/components/ui/SearchBar";
import Section from "@/app/components/adminDashboard/Section";
import PlaceholderCard from "@/app/components/adminDashboard/PlaceholderCard";
import RequestRow from "@/app/components/adminDashboard/RequestRow";
import requestsDataDefault from "@/app/data/requestsForAdminPage.json";

export default function RequestsPanel({
  data = requestsDataDefault,
  onShowDetails,
}) {
  const [query, setQuery] = useState("");
  const [normal, setNormal] = useState(data.normal || []);
  const [employer, setEmployer] = useState(data.employer || []);

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
    setter(list.filter((u) => u.id !== id));
  const refuseFrom = (list, setter, id) =>
    setter(list.filter((u) => u.id !== id));

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-4 rounded-xl bg-white p-6 text-center shadow">
        <div className="mb-4 text-3xl font-semibold text-[#E55B3C]">
          Request Management
        </div>
        <div className="flex justify-center">
          <SearchBar value={query} onChange={setQuery} onSearch={() => {}} />
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
                onDetails={() => onShowDetails?.(r)}
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
                onDetails={() => onShowDetails?.(r)}
                onAccept={() => acceptFrom(employer, setEmployer, r.id)}
                onRefuse={() => refuseFrom(employer, setEmployer, r.id)}
              />
            ))}
          </div>
        )}
      </Section>
    </div>
  );
}

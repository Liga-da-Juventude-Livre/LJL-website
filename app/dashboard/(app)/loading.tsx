// Shown while a dashboard page loads, so navigation feels instant instead of freezing on the old page.
export default function Loading() {
  return (
    <div className="dash-skeleton" aria-busy="true" aria-label="Carregando">
      <div className="dash-skel dash-skel-title" />
      <div className="dash-skel" style={{ width: "28%" }} />
      <div className="dash-skel dash-skel-block" />
      <div className="dash-skel dash-skel-block" />
    </div>
  );
}

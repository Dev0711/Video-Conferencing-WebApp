
export default function Header({ category, title }) {
  return (
    <div className=" mb-10" style={{ textAlign: 'center' }}>
        <p className="text-3xl font-extrabold tracking-tight text-slate-900">
            {title}
        </p>
    </div>
  );
}

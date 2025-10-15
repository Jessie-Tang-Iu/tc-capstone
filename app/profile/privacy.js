

export default function Privacy() {
    return (
        <div className="space-y-8 px-5 h-[calc(100vh-180px)] md:h-[calc(100vh-240px)] overflow-y-auto">
            {/* Download my data */}
            <section>
                <h2 className="text-xl md:text-2xl font-bold text-black mb-6">Download my data</h2>
                <p className="text-sm text-black mb-4">Your profile data belongs to you, you can download an archive any time</p>
                <button className="px-6 py-2 bg-orange-100 text-black rounded-lg text-sm font-normal hover:bg-orange-200 transition-colors">
                    Request archive
                </button>
            </section>

            <hr className="border-gray-300" />

            {/* Types of data collected */}
            <section>
                <h2 className="text-xl md:text-2xl font-bold text-black mb-6">Types of data collected</h2>
                <p className="text-sm text-black leading-relaxed">
                    We collect different types of data depending on how you interact with us. This includes, for example, when you are on our site, responding to our promotional materials, and using our services to help you find a job. For example, we may collect your e-mail address and resume information when you create your account. As another example, we may collect information about your activity on our site, such as the searches you conduct and jobs you apply to. For more information on the types of data we collect, check out the <span className="underline">&apos;Data collection and use&apos;</span> section of our Privacy Policy.
                </p>
            </section>

            <hr className="border-gray-300" />

            {/* Cookies */}
            <section>
                <h2 className="text-xl md:text-2xl font-bold text-black mb-6">Cookies</h2>
                <p className="text-sm text-black leading-relaxed">
                    Our Cookie Policy explains how we use cookies, web beacons, and similar technologies, including some offered by third-parties, to collect data about you. For more information about our use of these technologies and your ability to opt out of them, please check out our <span className="underline">Cookie Policy</span>.
                </p>
            </section>

            <hr className="border-gray-300" />

            {/* Hide my data */}
            <section>
                <h2 className="text-xl md:text-2xl font-bold text-black mb-6">Hide my data</h2>
                <p className="text-sm text-black leading-relaxed">
                    You can also set your Resume and profile to &apos;not searchable&apos; by visiting your <span className="underline">resume privacy settings</span>. For more information on what it means to have a &apos;searchable&apos; or &apos;not searchable&apos; Indeed Resume, please visit the <span className="underline">&apos;Data collection and use&apos;</span> section of our Privacy Policy.
                </p>
            </section>
        </div>
    );
}
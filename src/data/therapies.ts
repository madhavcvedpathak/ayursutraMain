export interface Therapy {
    id: string;
    name: string;
    sanskritName: string;
    description: string;
    duration: string;
    benefits: string[];
    preProcedure: string[];
    postProcedure: string[];
    imageUrl: string;
}

export const therapies: Therapy[] = [
    {
        id: 'vamana',
        name: 'Therapeutic Emesis',
        sanskritName: 'Vamana',
        description: 'A medicated emesis therapy that removes Kapha toxins collected in the body and the respiratory tract. This is given to people with high Kapha imbalance.',
        duration: '60-90 Minutes (Procedure day) - requires 3-7 days prep',
        benefits: [
            'Relief from Asthma and Bronchitis',
            'Effective for Skin Diseases',
            'Reduces Obesity',
            'Clears Sinus Congestion'
        ],
        preProcedure: [
            'Oleation (Snehana) - Internal ghee consumption for 3-7 days',
            'Sudation (Swedana) - Steam therapy to loosen toxins',
            'Eat Kapha-aggravating foods (like yogurt, sweets) the night before to excite the dosha for elimination'
        ],
        postProcedure: [
            'Inhale herbal smoke (Dhumapana)',
            'Avoid loud speech and stress',
            'Follow a graduated diet (Samsarjana Krama) starting with thin rice gruel',
            'Avoid cold blasts of air'
        ],
        imageUrl: 'https://images.unsplash.com/photo-1600334089648-b0d9d302427f?auto=format&fit=crop&q=80&w=1000'
    },
    {
        id: 'virechana',
        name: 'Purgation Therapy',
        sanskritName: 'Virechana',
        description: 'A medicated purgation therapy used to remove Pitta toxins from the body that are accumulated in the liver and gallbladder.',
        duration: '45-60 Minutes (Observation time)',
        benefits: [
            'Detoxifies Liver and Blood',
            'Treats Skin Disorders like Eczema',
            'Relieves Hyperacidity',
            'Improves Digestion'
        ],
        preProcedure: [
            'Internal Oleation with medicated ghee',
            'Three days of oil massage and steam',
            'Light diet before the purgation day'
        ],
        postProcedure: [
            'Strict rest on the day of procedure',
            'Sip warm water only',
            'Follow the specific post-cleanse diet for 3-5 days',
            'Avoid sun exposure'
        ],
        imageUrl: 'https://images.unsplash.com/photo-1544367563-12123d8965cd?auto=format&fit=crop&q=80&w=1000'
    },
    {
        id: 'basti',
        name: 'Enema Therapy',
        sanskritName: 'Basti',
        description: 'Considered the mother of all treatments, Basti cleanses the accumulated Vata from the colon using medicated oil or decoctions.',
        duration: '30-45 Minutes',
        benefits: [
            'Treats Arthritis and Rheumatism',
            'Relieves Constipation',
            'Treats Neurological Disorders',
            'Rejuvenates the Body'
        ],
        preProcedure: [
            'Light massage (Abhyanga) on the lower back and abdomen',
            'Local steam (Nadi Sweda)',
            'Empty bladder and bowels before the procedure'
        ],
        postProcedure: [
            'Rest for 30-60 minutes',
            'Avoid sitting for long periods immediately after',
            'Consume light, warm food only when hungry'
        ],
        imageUrl: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&q=80&w=1000'
    },
    {
        id: 'nasya',
        name: 'Nasal Administration',
        sanskritName: 'Nasya',
        description: 'Existing impurities are removed from the head region through the nasal passage using medicated oils or powders.',
        duration: '30 Minutes',
        benefits: [
            'Clears Sinus Congestion',
            'Improves Eyesight',
            'Relieves Migraines',
            'Promotes Mental Clarity'
        ],
        preProcedure: [
            'Gentle facial massage with oil',
            'Steam inhalation to open nasal passages'
        ],
        postProcedure: [
            'Gargle with warm water',
            'Avoid exposure to cold air',
            'Do not sleep immediately after treatment'
        ],
        imageUrl: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&q=80&w=1000'
    },
    {
        id: 'raktamokshana',
        name: 'Bloodletting',
        sanskritName: 'Raktamokshana',
        description: 'A refined procedure to eliminate toxins present in the bloodstream, often using leeches (Jaloka) or other methods.',
        duration: '30-60 Minutes',
        benefits: [
            'Treats Chronic Skin Conditions',
            'Reduces localized Inflammation',
            'Effective for Varicose Veins',
            'Purifies Blood'
        ],
        preProcedure: [
            'Detailed examination of the site',
            'Cleaning the area with antiseptic herbal water'
        ],
        postProcedure: [
            'Dressing of the area with turmeric or antiseptic herbs',
            'Avoid spicy and fermented foods',
            'Avoid getting the area wet for 24 hours'
        ],
        imageUrl: 'https://images.unsplash.com/photo-1579126038374-6064e9370f0f?auto=format&fit=crop&q=80&w=1000'
    }
];

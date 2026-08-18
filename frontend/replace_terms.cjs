const fs = require('fs');
const path = require('path');

const replacements = [
    { from: /Deploy Branch/g, to: 'Add Branch' },
    { from: /SELECT ASSET/g, to: 'SELECT VEHICLE' },
    { from: />Asset</g, to: '>Vehicle<' },
    { from: /Deploy Asset/g, to: 'Add Vehicle' },
    { from: /Modify Asset Profile/g, to: 'Edit Vehicle' },
    { from: /Initialize New Asset/g, to: 'Add New Vehicle' },
    { from: /Fleet Assets/g, to: 'Fleet Vehicles' },
    { from: /Asset Image Link/g, to: 'Vehicle Image URL' },
    { from: /Deployment Window/g, to: 'Rental Period' },
    { from: /Clearance Status/g, to: 'Booking Status' },
    { from: /Featured <span className="text-hollow text-\[#8A0303\]">Assets<\/span>/g, to: 'Featured <span className="text-hollow text-[#8A0303]">Vehicles</span>' },
    { from: /Deploy <ArrowRight/g, to: 'Book <ArrowRight' },
    { from: /Deploy Date/g, to: 'Pickup Date' },
    { from: /Deploy Time/g, to: 'Pickup Time' },
    { from: /Authorize Clearance/g, to: 'Submit' },
    { from: /Request <span className="text-zinc-500">Clearance<\/span>/g, to: 'Create <span className="text-zinc-500">Account</span>' },
    { from: /No clearance\?/g, to: 'No account?' },
    { from: /Clearance for/g, to: 'Booking for' },
    { from: /Select your asset for deployment\./g, to: 'Select a vehicle to rent.' },
    { from: /No assets available/g, to: 'No vehicles available' },
    { from: /Initiate Clearance/g, to: 'Book Now' },
    { from: /Asset Upgrades/g, to: 'Features' },
    { from: /Asset is ready for deployment\./g, to: 'Your vehicle is successfully booked.' },
    { from: /Protocol: Clearance/g, to: 'Booking Details' },
    { from: /Total Impact/g, to: 'Total Price' },
    { from: /Security Hold/g, to: 'Security Deposit' },
    { from: /Asset Specification/g, to: 'Vehicle Details' }
];

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach((file) => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else if (file.endsWith('.jsx') || file.endsWith('.js')) {
            results.push(file);
        }
    });
    return results;
}

const files = walk(path.join(__dirname, 'src'));

let changedFilesCount = 0;

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;
    
    replacements.forEach(rep => {
        content = content.replace(rep.from, rep.to);
    });
    
    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
        changedFilesCount++;
        console.log('Updated:', file);
    }
});

console.log(`Replaced terms in ${changedFilesCount} files.`);

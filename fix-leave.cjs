const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/pages/Leave.jsx');
let content = fs.readFileSync(filePath, 'utf8');

console.log('Reading file:', filePath);
console.log('File size:', content.length, 'bytes');

// Replace synchronous handlers with async ones
// This is a simple line-by-line approach

const lines = content.split('\n');
let inApproveHandler = false;
let inRejectHandler = false;
let output = [];

for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const nextLine = i + 1 < lines.length ? lines[i + 1] : '';
    
    // Check if this is the start of approve handler
    if (line.includes('onClick={() => {') && nextLine.includes('approveLeave(leave.id)')) {
        output.push(line.replace('onClick={() => {', 'onClick={async () => {'));
        output.push(lines[i + 1].replace('approveLeave(leave.id);', 'setProcessingId(leave.id);\n                                        const result = await approveLeave(leave.id);\n                                        if (result?.success) {'));
        
        // Skip to the toast.success line
        i += 2;
        let foundToast = false;
        while (i < lines.length && !foundToast) {
            if (lines[i].includes('toast.success("Leave Approved"')) {
                output.push(lines[i]);
                foundToast = true;
                break;
            }
            i++;
        }
        
        if (foundToast) {
            // Skip the closing }); and add our new structure
            i += 2; // Skip the }} and DropdownMenuItem closing
            output.push('                                        } else {');
            output.push('                                            toast.error("Failed to Approve", { description: result?.error || "Something went wrong." });');
            output.push('                                        }');
            output.push('                                        setProcessingId(null);');
            output.push(lines[i]); // Re-add the className line
        }
        continue;
    }
    
    // Check if this is the start of reject handler  
    if (line.includes('onClick={() => {') && nextLine.includes('rejectLeave(leave.id)')) {
        output.push(line.replace('onClick={() => {', 'onClick={async () => {'));
        output.push(lines[i + 1].replace('rejectLeave(leave.id);', 'setProcessingId(leave.id);\n                                        const result = await rejectLeave(leave.id);\n                                        if (result?.success) {'));
        
        // Skip to the toast.error line
        i += 2;
        let foundToast = false;
        while (i < lines.length && !foundToast) {
            if (lines[i].includes('toast.error("Leave Rejected"')) {
                output.push(lines[i]);
                foundToast = true;
                break;
            }
            i++;
        }
        
        if (foundToast) {
            // Skip closing and add our new structure
            i += 2;
            output.push('                                        } else {');
            output.push('                                            toast.error("Failed to Reject", { description: result?.error || "Something went wrong." });');
            output.push('                                        }');
            output.push('                                        setProcessingId(null);');
            output.push(lines[i]); // Re-add the destructive prop line
        }
        continue;
    }
    
    output.push(line);
}

const updatedContent = output.join('\n');
fs.writeFileSync(filePath, updatedContent);
console.log('File updated successfully!');
console.log('Changes saved to:', filePath);

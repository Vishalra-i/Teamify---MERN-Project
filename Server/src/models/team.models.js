import mongoose from 'mongoose';

const { Schema } = mongoose;

const teamSchema = new Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    users: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }]
}, {
    timestamps: true
});

export const Team = mongoose.model('Team', teamSchema);

import mongoose from 'mongoose'
import env from './environment'

// ====================================================================
// CẤU HÌNH KẾT NỐI MONGODB
// ====================================================================

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(env.MONGODB_URI)

    console.log(`✅ MongoDB connected: ${conn.connection.host}`)
    console.log(`📁 Database: ${conn.connection.name}`)

    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err)
    })

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️ MongoDB disconnected')
    })

    return conn
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message)
    process.exit(1)
  }
}

export default connectDB

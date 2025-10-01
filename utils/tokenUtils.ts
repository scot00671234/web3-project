import { Connection, PublicKey, Transaction, SystemProgram, Keypair } from '@solana/web3.js'
import { 
  TOKEN_PROGRAM_ID, 
  createInitializeMintInstruction,
  createAssociatedTokenAccountInstruction,
  createMintToInstruction,
  getMinimumBalanceForRentExemptMint,
  MINT_SIZE,
  getAssociatedTokenAddress
} from '@solana/spl-token'

// Platform fee wallet - from environment variable
const PLATFORM_WALLET = new PublicKey(
  process.env.NEXT_PUBLIC_PLATFORM_WALLET || 'CX6NvKqJwM1LVJmHL8XEpEcn8wrrEfLdxYhvNfZAS1P9'
)

export async function createToken(
  connection: Connection,
  payer: PublicKey,
  sendTransaction: any,
  name: string,
  symbol: string,
  decimals: number,
  initialSupply: number
) {
  try {
    // Generate new mint keypair
    const mintKeypair = Keypair.generate()
    
    // Get the minimum lamports for rent exemption
    const lamports = await getMinimumBalanceForRentExemptMint(connection)
    
    // Get associated token account for the creator
    const associatedTokenAddress = await getAssociatedTokenAddress(
      mintKeypair.publicKey,
      payer
    )
    
    const transaction = new Transaction().add(
      // Create mint account
      SystemProgram.createAccount({
        fromPubkey: payer,
        newAccountPubkey: mintKeypair.publicKey,
        space: MINT_SIZE,
        lamports,
        programId: TOKEN_PROGRAM_ID,
      }),
      // Initialize mint
      createInitializeMintInstruction(
        mintKeypair.publicKey,
        decimals,
        payer, // mint authority
        payer, // freeze authority
        TOKEN_PROGRAM_ID
      ),
      // Create associated token account for creator
      createAssociatedTokenAccountInstruction(
        payer,
        associatedTokenAddress,
        payer,
        mintKeypair.publicKey
      ),
      // Mint initial supply to creator
      createMintToInstruction(
        mintKeypair.publicKey,
        associatedTokenAddress,
        payer,
        initialSupply * Math.pow(10, decimals)
      )
    )

    const latestBlockhash = await connection.getLatestBlockhash('confirmed')
    transaction.recentBlockhash = latestBlockhash.blockhash
    transaction.feePayer = payer
    transaction.partialSign(mintKeypair)

    const signature = await sendTransaction(transaction, connection, {
      skipPreflight: false,
      preflightCommitment: 'confirmed'
    })
    
    await connection.confirmTransaction({
      signature,
      ...latestBlockhash
    }, 'confirmed')
    
    // Store token metadata (in production, save to your database/IPFS)
    console.log('Token created:', {
      mint: mintKeypair.publicKey.toString(),
      name,
      symbol,
      decimals,
      initialSupply
    })
    
    return {
      mint: mintKeypair.publicKey,
      signature
    }
  } catch (error) {
    console.error('Token creation error:', error)
    throw error
  }
}

export async function calculateFirstBuyerFee(amount: number): Promise<number> {
  // 0.5% platform fee on first purchase
  const platformFeePercent = 0.005
  return amount * platformFeePercent
}

export async function transferPlatformFee(
  connection: Connection,
  payer: PublicKey,
  sendTransaction: any,
  amount: number
): Promise<string> {
  try {
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: payer,
        toPubkey: PLATFORM_WALLET,
        lamports: amount * 1e9, // Convert SOL to lamports
      })
    )
    
    const signature = await sendTransaction(transaction, connection)
    await connection.confirmTransaction(signature, 'confirmed')
    
    return signature
  } catch (error) {
    console.error('Fee transfer error:', error)
    throw error
  }
}

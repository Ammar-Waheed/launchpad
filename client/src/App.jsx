import { ethers } from "ethers"
import { useEffect, useRef, useState } from "react"
import abi from "../../truffle/build/contracts/TokenSale.json"
import "./styles.css"

function App() {
    const [provier, setProvier] = useState()
    const [signer, setSigner] = useState()
    const [accounts, setAccounts] = useState([])
    const [contract1, setContract1] = useState()
    const [contract2, setContract2] = useState()
    const [presaleData, setPresaleData] = useState([])
    const [amounts, setAmounts] = useState([])
    const [addresses, setAddresses] = useState([])
    const particiapntAddress = useRef("")
    const participantAmount = useRef(NaN)
    const amount2Buy = useRef(NaN)
    const contractAddress = "0xeB96BcbDb40c032750A2234B37Caf45FbfF1589E"

    useEffect(() => {
        ;(async () => {
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            setProvier(provider)
            const accounts = await provider.send("eth_requestAccounts", [])
            console.log("accounts", accounts)
            setAccounts(accounts)
            const signer = provider.getSigner()
            setSigner(signer)
            const contract1 = new ethers.Contract(
                contractAddress,
                abi,
                provider
            )
            setContract1(contract1)
            const contract2 = new ethers.Contract(contractAddress, abi, signer)
            setContract2(contract2)
        })()
        window.ethereum.on("accountsChanged", (accounts) => {
            console.log(accounts)
            setAccounts(accounts)
        })
    }, [])

    const buyTokens = async (e) => {
        e.preventDefault()
        const fee = 0.000000000000000001 * amount2Buy.current
        try {
            const tx = await contract2["buyTokens(uint256)"](amount2Buy.current, {
                value: ethers.utils.parseEther(fee.toFixed(18).toString())
            })
            console.log(tx)
        } catch (err) {
            console.error(err)
        }
    }

    const claimTokens = async () => {
        try {
            const tx = await contract2["claimPresaleTokens()"]()
            console.log(tx)
        } catch (err) {
            console.error(err)
        }
    }

    const addParticipant = (e) => {
        e.preventDefault()
        setPresaleData([
            ...presaleData,
            {
                address: particiapntAddress.current,
                amount: participantAmount.current
            }
        ])
        setAmounts([...amounts, participantAmount.current])
        setAddresses([...addresses, particiapntAddress.current])
    }

    const add2Presale = async () => {
        const [amountBytes, addressBytes] = getEncodedBytes()
        try {
            const tx = await contract2["addToPresale(bytes[],bytes[])"](
                addressBytes,
                amountBytes
            )
            console.log(tx)
        } catch (err) {
            console.error(err)
        }
    }

    const getEncodedBytes = () => {
        const abiEncoder = ethers.utils.defaultAbiCoder
        const amountBytes = amounts.map((amount) =>
            abiEncoder.encode(["uint"], [amount])
        )
        const addressBytes = addresses.map((address) =>
            abiEncoder.encode(["uint"], [address])
        )
        return [amountBytes, addressBytes]
    }

    return (
        <div id="App">
            <section className="buyer container">
                <h1>Buyer</h1>
                <form onSubmit={buyTokens}>
                    <input
                        className="inp-data"
                        type="number"
                        placeholder="amount to buy"
                        onChange={(e) => {
                            amount2Buy.current = e.target.valueAsNumber
                        }}
                    />
                    <input type="submit" value="Buy Tokens" />
                </form>
                <button onClick={claimTokens}>Claim Presale Tokens</button>
            </section>
            <section className="seller container">
                <h1>Seller</h1>
                <form onSubmit={addParticipant}>
                    <input
                        type="text"
                        className="inp-data"
                        placeholder="participant address"
                        onChange={(e) => {
                            particiapntAddress.current = e.target.value
                        }}
                    />
                    <input
                        type="number"
                        className="inp-data"
                        placeholder="amount of tokens"
                        onChange={(e) => {
                            participantAmount.current = e.target.valueAsNumber
                        }}
                    />
                    <input type="submit" value="Add Participant" />
                </form>
                <button onClick={add2Presale}>Add To Presale</button>
            </section>
        </div>
    )
}

export default App

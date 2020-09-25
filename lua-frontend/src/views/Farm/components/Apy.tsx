import React, { useEffect, useState, useMemo } from 'react'
import styled from 'styled-components'
import { StringLiteral } from 'typescript'
import { useWallet } from 'use-wallet'
import useSushi from '../../../hooks/useSushi'
import { BigNumber } from '../../../sushi'
import { getLPTokenStaked, getNewRewardPerBlock } from '../../../sushi/utils'
import { getContract } from '../../../utils/erc20'
import { provider } from 'web3-core'
import { getBalanceNumber } from '../../../utils/formatBalance'
import useBlock from '../../../hooks/useBlock'

interface ApyProps {
    pid: number
    lpTokenAddress: string
    symbolShort: string
}

const Apy: React.FC<ApyProps> = ({ pid, lpTokenAddress, symbolShort }) => {
    const sushi = useSushi()
    const { ethereum } = useWallet()
    
    const block = useBlock()
    const lpContract = useMemo(() => {
      return getContract(ethereum as provider, lpTokenAddress)
    }, [ethereum, lpTokenAddress])

    const [newReward, setNewRewad] = useState<BigNumber>()
    useEffect(() => {
        async function fetchData() {
            const data = await getNewRewardPerBlock(sushi, pid + 1)
            setNewRewad(data)
        }
        if (sushi) {
            fetchData()
        }
    }, [sushi, setNewRewad, block])

    const [totalStake, setTotalStake] = useState<BigNumber>()
    useEffect(() => {
        async function fetchData() {
            const data = await getLPTokenStaked(sushi, lpContract)
            setTotalStake(data)
        }
        if (sushi && lpContract) {
            fetchData()
        }
    }, [sushi, setTotalStake, lpContract, block])

    return (
        <StyledApy>
            <StyledBox>
                <StyledLabel>APY</StyledLabel>
                <StyledContent>~%</StyledContent>
            </StyledBox>
            <StyledBox>
                <StyledLabel>Total Staked LP Token</StyledLabel>
                <StyledContent>{totalStake  ? getBalanceNumber(totalStake) : '~'} {symbolShort}</StyledContent>
                {/* <StyledEquility>≈ 200.000 USD</StyledEquility> */}
            </StyledBox>
            <StyledBox>
                <StyledLabel>Reward per block</StyledLabel>
                <StyledContent>{newReward ? getBalanceNumber(newReward).toString() : '~'} LUA</StyledContent>
                {/* <StyledEquility>≈ 100 USD</StyledEquility> */}
            </StyledBox>
        </StyledApy>
    )
}
const StyledApy = styled.div`
    display: flex;
    justify-content: space-between;
    box-sizing: border-box;
    padding: ${(props) => props.theme.spacing[3]}px;
    border: 2px solid ${(props) => props.theme.color.grey[200]};
    border-radius: 12px;
    @media (max-width: 768px) {
        width: 80%;
        margin: 0 auto;
        text-align: center;
    }
`
const StyledBox = styled.div`

`
const StyledLabel = styled.span`
    color: ${(props) => props.theme.color.primary.main};
    font-size: 14px;
    display: block;
`

const StyledContent = styled.span`
    color: ${(props) => props.theme.color.white};
    font-weight: bold;
    display: block;
    padding: 10px 0;
`

const StyledEquility = styled.span`
    color: ${(props) => props.theme.color.grey[100]};
    font-size: 14px;
    display: block;
`

export default Apy
